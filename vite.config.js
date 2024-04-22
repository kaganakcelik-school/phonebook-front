import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  	proxy: {
			'/api': {
				target: 'https://b952bbbf-f04d-41a7-a07f-e52269fb33b4-00-vyh9dqzu1wlk.kirk.repl.co:8080',
				changeOrigin: true,
			},
		}
  },
})
