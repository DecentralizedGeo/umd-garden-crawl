import { defineConfig } from 'vitest/config';

export default defineConfig({
  envPrefix: ['PUBLIC_', 'VITE_'],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
