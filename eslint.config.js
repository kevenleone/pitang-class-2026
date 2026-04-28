import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
    {
        ignores: [
            '**/dist/**',
            '**/node_modules/**',
            '**/*.tgz',
            '**/out/**',
            '**/cypress/screenshots/**',
            '**/cypress/videos/**',
            '**/generated/**',
            '**/*.gen.ts',
            '**/*.gen.js',
        ],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            globals: globals.node,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },

    // Backend
    {
        files: ['packages/pitang-backend/**/*.{ts,tsx}'],
        languageOptions: {
            globals: globals.node,
        },
    },

    // Frontend
    {
        files: ['packages/pitang-frontend/**/*.{ts,tsx}'],
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': 'warn',
        },
        languageOptions: {
            globals: globals.browser,
        },
    },

    // E2E
    {
        files: ['packages/pitang-e2e/**/*.{ts,tsx,cy.ts}'],
        languageOptions: {
            globals: globals.node,
        },
    },

    // JavaScript intro (relaxed rules for learning)
    {
        files: ['packages/pitang-javascript-intro/**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },

    // JS config files (CJS modules)
    {
        files: ['**/*.{js,cjs,mjs}'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
);
