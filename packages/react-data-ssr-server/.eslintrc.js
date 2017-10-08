module.exports = {
  extends: [
    'google',
    'prettier',
    'prettier/react',
  ],
  plugins: [
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2016,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    },
  },
  rules: {
    'prettier/prettier': ['error', {
      singleQuote: true,
      trailingComma: 'es5',
    }],
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
  },
};
