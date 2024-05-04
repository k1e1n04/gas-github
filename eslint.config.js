import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginGas from "eslint-plugin-googleappsscript";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {ignores: ["dist", ".eslintrc.cjs", "esbuild.js", "eslint.config.js"]},
  {
    languageOptions: {
      globals: pluginGas.environments.googleappsscript.globals
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    }
  },
];
