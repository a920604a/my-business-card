import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/my-business-card/',  // 👈 根據你 repo 名稱設定
  plugins: [react()],
});
