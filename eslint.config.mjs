import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Archivos a procesar
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },

  // Archivos a ignorar
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".vercel/**",
      "coverage/**",
      "prisma/migrations/**",
      "*.config.{js,mjs,cjs}",
    ],
  },

  // Configuración de entorno (Node.js)
  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },

  // Configuración base de ESLint
  pluginJs.configs.recommended,

  // Configuración de TypeScript
  ...tseslint.configs.recommended,

  // Reglas personalizadas
  {
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],

      // General JavaScript/Node rules
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "warn",
      "quote-props": ["warn", "as-needed"],

      // Import rules
      "no-duplicate-imports": "error",
    },
  },

  // Prettier (debe ir al final)
  prettier,
];
