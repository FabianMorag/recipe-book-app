import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    allowOnly: !process.env.CI,
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
  },
});
