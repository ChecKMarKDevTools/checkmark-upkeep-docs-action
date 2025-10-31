import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/integration/**/*.test.js'],
    exclude: ['tests/unit/**/*'],
    testTimeout: 30000, // Integration tests may take longer
    setupFiles: ['tests/setup.js'],
  },
});
