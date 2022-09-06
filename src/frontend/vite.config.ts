import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src/frontend/',
  publicDir: 'src/frontend/public/',
  build: {
    outDir: '../../dist/frontend'
  },
  plugins: [vue()]
})
