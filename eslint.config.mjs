import tseslint from "typescript-eslint";

export default [
  {
    ignores: [".next/**", ".open-next/**", "node_modules/**", "supabase/functions/**"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
