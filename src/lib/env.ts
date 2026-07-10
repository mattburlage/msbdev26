// Build-time environment flags, read in one place so every page and component
// resolves them identically.
//
// Note the two mechanisms are intentional: ENVIRONMENT comes from .env via
// Vite (import.meta.env), while SHOW_WRITING is set in the shell by deploy
// scripts, which only process.env sees at build time.

export const isProd = import.meta.env.ENVIRONMENT === 'production';
export const showWriting = process.env.SHOW_WRITING !== 'false';
