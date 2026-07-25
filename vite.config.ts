/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    return {
        server: {
            port: 3000,
            host: '0.0.0.0',
        },
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            },
        },
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./vitest.setup.ts'],
            include: ['src/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
        },
    };
});
