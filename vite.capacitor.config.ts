
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Vite config for Capacitor build.
 * Uses plain Vite (not TanStack Start / Nitro) so outDir is respected.
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  build: {
    outDir: ".output/capacitor",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "index.capacitor.html",
      },
    },
  },
});
