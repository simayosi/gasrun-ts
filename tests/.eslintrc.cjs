module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:jest/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  overrides: [
    {
      env: {
        commonjs: true,
      },
      files: ["*.cjs"],
    },
    {
      env: {
        browser: true,
        es2021: true,
      },
      files: ["*.mjs"],
    },
    {
      env: {
        es2021: true,
      },
      files: ["*.ts"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            args: "all",
            argsIgnorePattern: "^_",
            caughtErrors: "all",
            caughtErrorsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            ignoreRestSiblings: true,
          },
        ],
      },
    },
    {
      files: [".eslintrc.cjs"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
};
