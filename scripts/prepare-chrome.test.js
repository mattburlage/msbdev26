import assert from 'node:assert/strict';
import { test } from 'node:test';
import { aptConfiguration, chromeDependencies, isUbuntuNoble, missingLibraries, ubuntuSources } from './prepare-chrome.js';

test('collects every unresolved library without treating resolved paths as missing', () => {
  assert.deepEqual(missingLibraries('  libatk-1.0.so.0 => not found\n libnss3.so => /usr/lib/libnss3.so (0x123)\n libatk-bridge-2.0.so.0 => not found\n'), ['libatk-1.0.so.0', 'libatk-bridge-2.0.so.0']);
  assert.deepEqual(missingLibraries('linux-vdso.so.1 (0x123)\n'), []);
});
test('uses Chrome dependency declarations including versions and alternatives', () => {
  assert.equal(chromeDependencies('libatk1.0-0 (>= 2.11.90)\nlibgtk-3-0 | libgtk-4-1\n'), 'libatk1.0-0 (>= 2.11.90), libgtk-3-0 | libgtk-4-1');
  assert.throws(() => chromeDependencies(''), /Invalid/);
  assert.throws(() => chromeDependencies('libatk; run-command'), /Invalid/);
});
test('provisions only the documented Cloudflare Ubuntu architecture/release', () => {
  assert.ok(isUbuntuNoble('ID=ubuntu\nVERSION_ID="24.04"', 'x64'));
  assert.ok(!isUbuntuNoble('ID=debian\nVERSION_ID="13"', 'x64'));
  assert.ok(!isUbuntuNoble('ID=ubuntu\nVERSION_ID="22.04"', 'x64'));
  assert.ok(!isUbuntuNoble('ID=ubuntu\nVERSION_ID="24.04"', 'arm64'));
});
test('APT uses only official signed Ubuntu sources and private state', () => {
  const sources = ubuntuSources('/usr/share/keyrings/ubuntu-archive-keyring.gpg');
  assert.ok(sources.includes('https://archive.ubuntu.com/ubuntu'));
  assert.ok(sources.includes('https://security.ubuntu.com/ubuntu'));
  assert.equal((sources.match(/Signed-By:/g) ?? []).length, 2);
  assert.ok(!sources.includes('Trusted: yes'));
  const config = aptConfiguration('/tmp/test');
  assert.ok(config.includes('Dir::State "/tmp/test/state"'));
  assert.ok(config.includes('Dir::Etc::parts "/tmp/test/empty"'));
  assert.ok(!config.includes('AllowUnauthenticated'));
});
