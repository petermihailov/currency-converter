/// <reference types="vitest/config" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

/** @see https://vitejs.dev/config/ */
export default defineConfig({
  base: './',

  css: {
    modules: {
      generateScopedName: '[local]--[hash:4]',
      localsConvention: 'camelCaseOnly',
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    coverage: { reporter: ['text', 'lcov'] },
  },

  plugins: [
    /** @see https://vite-pwa-org.netlify.app/ */
    VitePWA({
      registerType: 'autoUpdate',

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
      },

      manifest: {
        name: 'Currency',
        short_name: 'Currency',
        description: 'Currency converter',
        theme_color: '#000000',
        icons: [
          {
            src: '64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: '512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),

    /** @see https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md */
    react(),
  ],
})
