import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hmrClientPort = process.env.VITE_HMR_CLIENT_PORT;

const allowedHosts = ["infra-guys.com", "www.infra-guys.com"];

/** Local dev defaults to loopback only (no LAN broadcast). Docker passes `--host 0.0.0.0` to allow port publish. */
const devHost = process.env.VITE_DEV_HOST ?? "localhost";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@dynamodb-generated": path.resolve(
        __dirname,
        "../infra/dynamodb/generated"
      ),
    },
  },
  server: {
    host: devHost,
    port: 5173,
    allowedHosts,
    watch: { usePolling: true },
    ...(hmrClientPort
      ? { hmr: { clientPort: Number(hmrClientPort) } }
      : {}),
  },
  preview: {
    host: devHost,
    allowedHosts,
  },
});
