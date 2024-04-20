import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  	proxy: {
			'/api': {
				target: 'https://d8233201-3508-4bf8-9607-4cc95993078b-00-280nk92uiyvtf.spock.repl.co:8080',
				changeOrigin: true,
			},
		}
  },
})
