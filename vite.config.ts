import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

const DEV_HOST = process.env.VITE_DEV_HOST ?? "127.0.0.1";
const DEV_PORT = Number(process.env.VITE_DEV_PORT ?? 5173);
const PREVIEW_PORT = Number(process.env.VITE_PREVIEW_PORT ?? DEV_PORT);
const API_PROXY_TARGET = process.env.VITE_API_PROXY ?? "http://127.0.0.1:3002";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: DEV_HOST,
    port: DEV_PORT,
    open: true,
    strictPort: false,
    proxy: {
      "/api": API_PROXY_TARGET,
    },
  },
  preview: {
    host: DEV_HOST,
    port: PREVIEW_PORT,
    strictPort: false,
  },
  build: {
    sourcemap: true,
  },
});
