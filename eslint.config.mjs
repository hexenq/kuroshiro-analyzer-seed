import js from "@eslint/js";
import globals from "globals";

export default [
    { ignores: ["coverage/**", "dist/**", "lib/**", "node_modules/**", "tmp/**"] },
    js.configs.recommended,
    {
        files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.node, ...globals.browser, ...globals.jest }
        }
    }
];
