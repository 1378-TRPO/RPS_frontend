/// <reference types="vitest/config" />

import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const spaHtmlBypass = (req: { headers: { accept?: string } }) =>
    req.headers.accept?.includes('text/html') ? '/index.html' : undefined;

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, 'src'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/auth': { target: 'http://127.0.0.1:8000', changeOrigin: true },
            '/users': { target: 'http://127.0.0.1:8000', changeOrigin: true },
            '/services': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                // SPA-роут /services не должен уходить на API при F5 / прямом открытии
                bypass: spaHtmlBypass,
            },
            '/manager': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                // SPA-роут /manager/* не должен уходить на API при F5 / прямом открытии
                bypass: spaHtmlBypass,
            },
            '/health': { target: 'http://127.0.0.1:8000', changeOrigin: true },
        },
    },
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts'],
    },
    build: {
        rolldownOptions: {
            output: {
                advancedChunks: {
                    minSize: 0,
                    minShareCount: 1,
                    groups: [
                        {
                            name: 'react',
                            test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                            priority: 20,
                        },
                        { name: 'mantine', test: /node_modules[\\/]@mantine[\\/]/, priority: 20 },
                        { name: 'query', test: /node_modules[\\/]@tanstack[\\/]/, priority: 20 },
                        { name: 'vendor', test: /node_modules[\\/]/, priority: 10 },
                    ],
                },
            },
        },
    },
});
