import { execFile } from 'node:child_process';
import { access, copyFile, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const run = async (command, args, options = {}) => {
  try {
    return await exec(command, args, { maxBuffer: 8 * 1024 * 1024, timeout: 180_000, ...options });
  } catch (error) {
    throw new Error(`${command} failed: ${error.stderr || error.message}`);
  }
};

export function missingLibraries(output) {
  return [...output.matchAll(/^\s*(\S+)\s+=>\s+not found\s*$/gm)].map((match) => match[1]);
}

export function chromeDependencies(debDeps) {
  // This is Google's dependency declaration shipped with the pinned Chrome,
  // also used by Puppeteer's official --install-deps implementation.
  const dependencies = debDeps.split('\n').map((line) => line.trim()).filter(Boolean);
  if (!dependencies.length || dependencies.some((line) => !/^[a-z0-9][a-z0-9+.:~()|<>= -]*$/.test(line))) {
    throw new Error('Invalid Chrome deb.deps declaration.');
  }
  return dependencies.join(', ');
}

export function isUbuntuNoble(osRelease, architecture) {
  const fields = Object.fromEntries(osRelease.split('\n').filter((line) => line.includes('='))
    .map((line) => { const at = line.indexOf('='); return [line.slice(0, at), line.slice(at + 1).replace(/^"|"$/g, '')]; }));
  return fields.ID === 'ubuntu' && fields.VERSION_ID === '24.04' && architecture === 'x64';
}

export function ubuntuSources(keyring) {
  // No third-party repositories or key downloads. APT authenticates the signed
  // Ubuntu indexes and package hashes using the build image's existing keyring.
  return `Types: deb\nURIs: https://archive.ubuntu.com/ubuntu\nSuites: noble noble-updates\nComponents: main universe\nArchitectures: amd64\nSigned-By: ${keyring}\n\nTypes: deb\nURIs: https://security.ubuntu.com/ubuntu\nSuites: noble-security\nComponents: main universe\nArchitectures: amd64\nSigned-By: ${keyring}\n`;
}

export function aptConfiguration(root) {
  // A private APT configuration avoids system caches, locks, hooks and writes.
  // Package installation is never invoked: satisfy is strictly download-only.
  const quote = (value) => JSON.stringify(value);
  return `Dir::Etc::main "/dev/null";
Dir::Etc::parts ${quote(join(root, 'empty'))};
Dir::Etc::sourcelist "/dev/null";
Dir::Etc::sourceparts ${quote(join(root, 'sources'))};
Dir::Etc::preferences "/dev/null";
Dir::Etc::preferencesparts ${quote(join(root, 'empty'))};
Dir::State ${quote(join(root, 'state'))};
Dir::State::status ${quote(join(root, 'state/status'))};
Dir::Cache ${quote(join(root, 'cache'))};
Dir::Log ${quote(join(root, 'log'))};
APT::Architecture "amd64";
Acquire::Retries "2";
Acquire::http::Timeout "30";
Acquire::https::Timeout "30";
APT::Update::Error-Mode "any";
`;
}

export async function prepareChromeEnvironment(executablePath) {
  const unchanged = { env: { ...process.env }, cleanup: async () => {} };
  if (process.platform !== 'linux') return unchanged;
  const initial = await run('ldd', [executablePath]);
  const missing = missingLibraries(initial.stdout);
  if (!missing.length) return unchanged;

  const osRelease = await readFile('/etc/os-release', 'utf8');
  if (!isUbuntuNoble(osRelease, process.arch)) {
    throw new Error(`Chrome libraries missing: ${missing.join(', ')}. Automatic rootless provisioning supports Ubuntu 24.04 x86_64 only; install Chrome's system dependencies on this host.`);
  }
  const keyring = '/usr/share/keyrings/ubuntu-archive-keyring.gpg';
  await access(keyring);
  const dependencies = chromeDependencies(await readFile(join(dirname(executablePath), 'deb.deps'), 'utf8'));
  const root = await mkdtemp(join(tmpdir(), 'msb-chrome-libs-'));
  const cleanup = () => rm(root, { recursive: true, force: true });
  try {
    for (const dir of ['empty', 'sources', 'state/lists/partial', 'cache/archives/partial', 'log', 'root']) {
      await mkdir(join(root, dir), { recursive: true });
    }
    await copyFile('/var/lib/dpkg/status', join(root, 'state/status'));
    const config = join(root, 'apt.conf');
    await writeFile(config, aptConfiguration(root));
    await writeFile(join(root, 'sources/ubuntu.sources'), ubuntuSources(keyring));
    const aptEnv = { ...process.env, APT_CONFIG: config };
    console.log(`Preparing missing Chrome libraries without root: ${missing.join(', ')}`);
    await run('apt-get', ['update'], { env: aptEnv });
    await run('apt-get', ['--download-only', '--no-install-recommends', '--no-upgrade', '-y', 'satisfy', dependencies], { env: aptEnv });
    const archives = (await readdir(join(root, 'cache/archives'))).filter((file) => file.endsWith('.deb'));
    if (!archives.length) throw new Error('APT downloaded no packages for the missing Chrome libraries.');
    for (const file of archives) {
      const packageName = (await run('dpkg-deb', ['--field', join(root, 'cache/archives', file), 'Package'])).stdout.trim();
      if (['libc6', 'libc-bin'].includes(packageName)) {
        throw new Error('Chrome dependency resolution would replace the host C library/loader. Refusing a mixed runtime.');
      }
      // Extract payloads only; never run a package's maintainer scripts.
      await run('dpkg-deb', ['--extract', join(root, 'cache/archives', file), join(root, 'root')]);
    }
    const libraryPaths = ['usr/lib/x86_64-linux-gnu', 'lib/x86_64-linux-gnu', 'usr/lib', 'lib']
      .map((path) => join(root, 'root', path));
    // Make any downloaded fonts visible without running fontconfig package hooks.
    const fontConfig = join(root, 'fonts.conf');
    const xml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    await writeFile(fontConfig, `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig><include ignore_missing="yes">/etc/fonts/fonts.conf</include><dir>${xml(join(root, 'root/usr/share/fonts'))}</dir><cachedir>${xml(join(root, 'font-cache'))}</cachedir></fontconfig>`);
    const env = { ...process.env, FONTCONFIG_FILE: fontConfig, LD_LIBRARY_PATH: [...libraryPaths, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':') };
    const remaining = missingLibraries((await run('ldd', [executablePath], { env })).stdout);
    if (remaining.length) throw new Error(`Chrome libraries still missing after provisioning: ${remaining.join(', ')}`);
    console.log(`✓ Prepared Chrome dependencies from ${archives.length} authenticated Ubuntu packages; browser sandbox unchanged`);
    return { env, cleanup };
  } catch (error) {
    await cleanup();
    throw error;
  }
}
