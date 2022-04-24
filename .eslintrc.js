module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // "vue/no-unused-vars": [
    //   "error",
    //   {
    //     varsIgnorePattern: "^_",
    //   },
    // ],
    "@typescript-eslint/no-explicit-any": "off",
    "vue/no-unused-vars": [
      "error",
      {
        ignorePattern: "^_",
      },
    ],
  },
};
