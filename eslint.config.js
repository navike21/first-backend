// @ts-check
const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const globals = require('globals');
const sonarjs = require('eslint-plugin-sonarjs');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
	js.configs.recommended,
	sonarjs.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	{
		files: ['src/**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.eslint.json',
				tsconfigRootDir: __dirname,
			},
			globals: {
				...globals.node,
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'@typescript-eslint/no-require-imports': 'error',
			'no-console': 'warn',
			'no-unused-vars': 'off',
			'no-undef': 'off',
		},
	},
	{
		files: ['src/**/__tests__/**/*.ts', 'src/**/*.test.ts'],
		rules: {
			'sonarjs/no-hardcoded-ip': 'off',
			'sonarjs/no-clear-text-protocols': 'off',
			'sonarjs/no-undefined-argument': 'off',
			'sonarjs/no-unused-vars': 'off',
		},
	},
	{
		rules: {
			// Action-name strings like 'auth:password_changed' are not passwords
			'sonarjs/no-hardcoded-passwords': 'off',
		},
	},
	{
		ignores: ['dist/**', 'node_modules/**', '.vercel/**', 'coverage/**'],
	},
];
