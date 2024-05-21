import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Keep the CRA-era "baseUrl: src" imports (e.g. "store/actions/auth").
    alias: [
      {
        find: /^(assets|components|helpers|modules|routes|store)\//,
        replacement: `${src}/$1/`,
      },
    ],
  },
  server: { port: 5173 },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    css: false,
  },
});
