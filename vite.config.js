import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        clinicalAssessments: resolve(__dirname, 'projects/clinical-assessments.html'),
        choiceInventory: resolve(__dirname, 'projects/choice-inventory.html'),
      },
    },
  },

  server: {
    open: true,
    port: 3000,
  },
});
