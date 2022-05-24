import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import path from "path"

// 絕對路徑獲取
function resolve(dir) {
  return path.resolve(__dirname, dir);
}

export default defineConfig({
  plugins: [
    vue(),
    viteCommonjs()
  ],
  resolve: {
    alias: [{ find: "@", replacement: resolve("src") }],
  },
  server: {
    host: true,
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://192.168.2.250:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
