// eslint.config.mjs

import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Configuration for Server-Side (Node.js) Code
  {
    files: ["**/*.js", "**/*.cjs"], // Adjust the patterns as needed
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      // Add or override rules specific to server-side
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    env: {
      node: true,   // Enable Node.js global variables
      es6: true,    // Enable ES6 features
    },
    ...pluginJs.configs.recommended, // Apply recommended settings from @eslint/js
  },

  // Configuration for Client-Side (Browser) Code (Optional)
  {
    files: ["**/*.jsx", "**/*.mjs"], // Adjust the patterns as needed
    languageOptions: {
      sourceType: "module",
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      // Add or override rules specific to client-side
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    env: {
      browser: true, // Enable browser global variables
      es6: true,     // Enable ES6 features
    },
    ...pluginReact.configs.flat.recommended, // Apply recommended settings from eslint-plugin-react
  },
];
