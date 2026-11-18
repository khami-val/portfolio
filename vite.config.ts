import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `vite build` -> normal multi-file build for Vercel (images as separate files).
// `vite build --mode preview` -> one self-contained HTML for the shareable preview.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'preview' ? [viteSingleFile()] : [])],
  build: {
    assetsInlineLimit: mode === 'preview' ? 100_000_000 : 4096,
    outDir: mode === 'preview' ? 'dist-preview' : 'dist',
  },
}))
