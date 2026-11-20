import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".fredrin/**", ".agents/**", ".claude/**", ".next/**", "out/**", "next-env.d.ts", "evidence/**"]),
]);
