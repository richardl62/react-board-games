// True for the fully static, serverless build produced by 'npm run buildPages'
// (see vite.config.ts and package.json). Used to disable features that need
// the Express server, which isn't present when the app is deployed to
// GitHub Pages.
export const isStaticBuild = import.meta.env.MODE === 'pages';
