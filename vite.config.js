import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Agrega esta línea para importar el módulo `path`

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '/@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
});
