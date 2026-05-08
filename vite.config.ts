/// <reference types="vitest/config" />
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{ts,js}'],
    // Default to node; component tests opt into jsdom via the
    // /** @vitest-environment jsdom */ comment at the top of the file.
    environment: 'node',
    globals: false,
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/**/*.d.ts', 'src/lib/**/index.ts']
    }
  }
});
