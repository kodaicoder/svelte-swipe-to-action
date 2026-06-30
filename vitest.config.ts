import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { playwright } from '@vitest/browser-playwright';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
	plugins: [tailwindcss(), svelte()],
	resolve: {
		alias: { $lib: path.resolve('./src/lib') }
	},
	optimizeDeps: {
		include: ['phosphor-svelte']
	},
	test: {
		include: ['tests/**/*.test.{ts,js}'],
		setupFiles: ['vitest-browser-svelte'],
		browser: {
			enabled: true,
			headless: true,
			provider: playwright(),
			instances: [{ browser: 'chromium' }]
		}
	}
});
