import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    fileParallelism: false,
    css: true,
    allowOnly: !process.env.CI,
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
  },
});
