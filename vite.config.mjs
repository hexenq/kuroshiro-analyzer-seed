import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
    build: {
        target: "es2015",
        emptyOutDir: false,
        minify: mode === "minify",
        lib: {
            entry: "scripts/browser-entry.js",
            name: "SeedAnalyzer",
            formats: ["umd"],
            fileName: () => mode === "minify"
                ? "kuroshiro-analyzer-seed.min.js"
                : "kuroshiro-analyzer-seed.js"
        }
    }
}));
