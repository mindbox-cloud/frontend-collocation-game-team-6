import { defineConfig } from "vite";

export default defineConfig({
    // Base path for GitHub Pages deployment
    // This should match your GitHub repository name
    base: "/frontend-collocation-game-team-6/",

    // Build configuration
    build: {
        outDir: "dist",
        assetsDir: "assets",
        emptyOutDir: true,
    },

    // Development server configuration
    server: {
        open: true,
        port: 3000,
    },
});
