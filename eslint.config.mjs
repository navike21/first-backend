import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import pluginPrettier from 'eslint-plugin-prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    // Ignorar ciertos directorios y archivos
    ignores: [
      '**/dist',
      '**/node_modules',
      'jest.config.js',
      'webpack.config.js'
    ]
  },
  // Extender configuraciones recomendadas
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ),
  {
    // Opciones de lenguaje
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2024,
      sourceType: 'module'
    },
    // Plugins
    plugins: {
      prettier: pluginPrettier
    },
    // Reglas
    rules: {
      'no-console': 'warn',
      'prettier/prettier': 'error'
    }
  }
]
