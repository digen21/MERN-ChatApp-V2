import react from "@vitejs/plugin-react-swc";
import "dotenv/config";
import path from "path";
import { defineConfig } from "vite";

const PORT = process.env.VITE_CLIENT_PORT;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: Number(PORT),
  },
  preview: {
    port: Number(PORT),
  },
});
