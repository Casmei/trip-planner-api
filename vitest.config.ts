import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      reporter: ["text", "lcov", "html", "json-summary"],
      include: ["src/use-cases/**/*.ts"],
      exclude: [
        "src/env/*.ts",
        "src/use-cases/errors/**/*.ts",
        "src/repositories/*.ts",
        "src/repositories/**/*.ts",
        "src/use-cases/factories/**/*.ts",
        "**/*.spec.ts",
        "**/*.test.ts",
        "node_modules",
        "dist",
        "build",
        "utils",
      ],
    },
  },
});
