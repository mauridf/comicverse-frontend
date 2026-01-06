import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Define variáveis globais para evitar erro do 'process'
  define: {
    'process.env': {}
  }
})