import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    allowedHosts: [
      "be13-198-163-195-16.ngrok-free.app", // Ngrok hostini qo‘shish
    ],
    host: true, // Kerak bo‘lsa, serverni tashqaridan kirish mumkin qilish
  },
});
