/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7248',	// В настройках запуска проекта .NET 10, см. "App URL"
        secure: false,
        changeOrigin: true
      }
    }
  },
  build: {	// Компиляция приложения должна осуществляться в проект Backend-а
    outDir: 'backend/BackendApi/wwwroot',
    emptyOutDir: true
  },
  test: {
    environment: 'jsdom',	// DOM-окружение для будущего рендера компонентов
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      provider: 'istanbul', // или 'v8' - он быстрее, но менее точный
      reporter: ['text', 'json', 'html'], // форматы отчетов
      exclude: ['node_modules/', 'src/test/setup.ts'], // что исключить
    },
  }
})
