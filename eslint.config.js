import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
    {
        ignores: ['dist/**', 'node_modules/**', 'coverage/**', '**/*.config.{ts,js,mjs}', '**/*.d.ts'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                localStorage: 'readonly',
                navigator: 'readonly',
                fetch: 'readonly',
                FileReader: 'readonly',
                Blob: 'readonly',
                URL: 'readonly',
                Image: 'readonly',
                CustomEvent: 'readonly',
                AbortController: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                console: 'readonly',
                alert: 'readonly',
                XLSX: 'readonly',
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            'no-empty': ['error', { allowEmptyCatch: true }],
        },
    },
);
