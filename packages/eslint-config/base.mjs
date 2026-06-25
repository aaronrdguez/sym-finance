import { defineConfig, globalIgnores } from "eslint/config";

const baseConfig = defineConfig([
  globalIgnores(["node_modules/**", "dist/**", "build/**", ".next/**"]),
]);

export default baseConfig;
