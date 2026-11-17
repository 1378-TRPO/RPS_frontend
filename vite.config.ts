import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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
            '/health': { target: 'http://127.0.0.1:8000', changeOrigin: true },
        },
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
