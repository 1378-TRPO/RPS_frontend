import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            prettier,
        ],
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': 'warn',
            'simple-import-sort/exports': 'warn',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            '@typescript-eslint/no-explicit-any': 'error',
            eqeqeq: ['error', 'smart'],
            'no-throw-literal': 'error',
        },
        languageOptions: {
            globals: globals.browser,
        },
    },
]);
