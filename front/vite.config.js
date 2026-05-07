import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Esto permite que el servidor escuche en todas las interfaces de red
    port: 443       // Asegúrate de que el puerto esté abierto en tu firewall
  }
})
