import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'content-script': 'src/content-script.ts', // Changed from .js to .ts
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
})