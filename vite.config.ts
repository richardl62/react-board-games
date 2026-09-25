import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
    // The 'pages' mode (see 'buildPages' in package.json) builds a fully
    // static, serverless bundle for GitHub Pages, which serves this repo's
    // project site under /react-board-games/ rather than at the site root.
    base: mode === 'pages' ? '/react-board-games/' : '/',
    // The client is built into its own directory, separate from the compiled
    // server (dist/server and dist/shared), so that the server can serve just
    // the client files, and so that a client build doesn't delete the server.
    build: { outDir: 'dist/client' },
    plugins: [react(), svgr(), tsconfigPaths()],
}));