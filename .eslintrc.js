module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
  },
  ignorePatterns: ["frontend"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts"],
      },
    },
  },
};
