import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000
  },
  define: {
    global: "window" // This polyfills `global` to `window`
  },
  resolve: {
    alias: {
      buffer: "buffer",
      crypto: "crypto-browserify"
    }
  },
  optimizeDeps: {
    include: ["buffer", "crypto-browserify"]
  }
});
