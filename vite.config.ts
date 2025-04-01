import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const root = path.resolve(__dirname, 'src')
// https://vite.dev/config/
export default defineConfig({
	base: './',
	server: { port: 3000 },
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': root,
		},
	},
})
