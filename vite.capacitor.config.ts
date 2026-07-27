import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Vite config for Capacitor build.
 * Produces static assets for www/ folder (no SSR server).
 */
export default defineConfig({
  tanstackStart: {
    ssr: false,
  },
  vite: {
    build: {
      outDir: ".output/capacitor",
      rollupOptions: {
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
        },
      },
    },
  },
});
