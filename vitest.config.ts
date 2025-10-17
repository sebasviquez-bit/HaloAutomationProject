import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    watch: false,
    reporters: ['default', 'json'],
    globals: true,
    outputFile: {
      json: './report/vitest-results.json'
    }
  },
});


