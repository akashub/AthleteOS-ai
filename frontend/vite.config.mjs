// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// }) 

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      'Components': fileURLToPath(new URL('./Components', import.meta.url)),
      'Pages': fileURLToPath(new URL('./Pages', import.meta.url)),
      'Entities': fileURLToPath(new URL('./Entities', import.meta.url)),
    },
  },
})