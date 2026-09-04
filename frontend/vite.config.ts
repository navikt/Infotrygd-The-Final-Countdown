import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const chunkGroups: Record<string, string[]> = {
  vendor: ["react", "react-dom", "@navikt/ds-react", "@navikt/ds-css"],
};

function manualChunks(id: string): string | undefined {
  for (const [chunk, packages] of Object.entries(chunkGroups)) {
    if (packages.some((pkg) => id.includes(`node_modules/${pkg}`))) {
      return chunk;
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "@generated": path.resolve(__dirname, "generated"),
    },
  },

  server: {
    port: 3000,
    strictPort: false,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/oauth2": "http://localhost:4000",
    },
  },

  preview: {
    port: 4173,
    strictPort: false,
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },

  define: {
    "process.env.VITE_APP_VERSION": JSON.stringify(process.env.npm_package_version),
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "src/vite-env.d.ts", "src/env.ts"],
    },
  },
});
