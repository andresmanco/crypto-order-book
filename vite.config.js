import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: "public",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js", // Points to your existing CRA setup file
  },
});
