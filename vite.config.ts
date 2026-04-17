import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: { // Enable host and allow all hosts for development server / ngrok tunneling
    host: true,
    allowedHosts: true,
  },
})
