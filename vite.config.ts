/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "bundle",
    emptyOutDir: true,
    assetsDir: "assets",
  },
  server: {
    host: "0.0.0.0",
    port: 43173,
  },
  preview: {
    host: "0.0.0.0",
    port: 43173,
  },
  test: {
    environment: "node",
  },
});
