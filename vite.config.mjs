import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
    build: {
        target: "es2015",
        emptyOutDir: false,
        minify: mode === "minify",
        lib: {
            entry: "scripts/browser-entry.js",
            name: "SeedAnalyzer",
            formats: mode === "minify" ? ["umd"] : ["es", "umd"],
            fileName: format => `kuroshiro-analyzer-seed${mode === "minify" ? ".min" : ""}.${format === "es" ? "mjs" : "js"}`
        }
    }
}));
