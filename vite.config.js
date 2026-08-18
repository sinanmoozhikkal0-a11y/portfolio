import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function backendAutoStartPlugin() {
  return {
    name: "backend-autostart",
    configureServer() {
      // Automatically launch the Express backend server when Vite dev server starts
      import("./backend/server.js").catch((err) => {
        console.warn("[Vite Backend Start Warning]", err.message);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), backendAutoStartPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_DEV_BACKEND_URL || "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          const errorHandler = (err, req, res) => {
            console.warn(`[Vite Proxy Warning] Failed to proxy ${req.url}: ${err.message}`);
            if (res && typeof res.writeHead === "function" && !res.headersSent) {
              res.writeHead(502, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Proxy target is offline or unreachable" }));
            }
          };

          proxy.on("error", errorHandler);

          // Clear Vite's default duplicate logger listener to prevent stack trace spam
          process.nextTick(() => {
            const listeners = proxy.listeners("error");
            if (listeners.length > 1) {
              proxy.removeAllListeners("error");
              proxy.on("error", errorHandler);
            }
          });
        },
      },
      "/uploads": {
        target: process.env.VITE_DEV_BACKEND_URL || "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
  },
});
