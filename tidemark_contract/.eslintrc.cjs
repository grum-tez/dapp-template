module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],

  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
  ignorePatterns: ['node_modules/', '*.cjs', '*.js', '*.d.ts'],
}
//Parsing error: ESLint was configured to run on `<tsconfigRootDir>/.eslintrc.js` using
// `parserOptions.project`: <tsconfigRootDir>/../../../../../users/graemeford/royaltiesproject/tidemark-dapp/tidemark_contract/tsconfig.json
// However, that TSConfig does not include this file. Either:
// - Change ESLint's list of included files to not include this file
// - Change that TSConfig to include this file
// - Create a new TSConfig that includes this file and include it in your parserOptions.project
// See the typescript-eslint docs for more info: https://typescript-eslint.io/linting/troubleshooting#i-get-errors-telling-me-eslint-was-configured-to-run--however-that-tsconfig-does-not--none-of-those-tsconfigs-include-this-file
