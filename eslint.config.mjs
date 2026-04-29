import tseslint from "typescript-eslint";

export default [
  {
    ignores: [".next/**", "node_modules/**", "supabase/functions/**"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
