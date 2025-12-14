/// <reference types="vitest/config" />
// see: https://vitest.dev/guide/#:~:text=If%20you%20are%20already%20using%20Vite%2C%20add%20test%20property%20in%20your%20Vite%20config.%20You%27ll%20also%20need%20to%20add%20a%20reference%20to%20Vitest%20types%20using%20a%20triple%20slash%20directive%20at%20the%20top%20of%20your%20config%20file.
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
