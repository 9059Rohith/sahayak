import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dev server proxies /api to the Express backend so the frontend can use
// same-origin relative URLs (no CORS headaches, no hardcoded host in code).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_API_TARGET || "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
