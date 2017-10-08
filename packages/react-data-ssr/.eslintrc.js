module.exports = {
  extends: [
    'google',
    'plugin:react/recommended',
    'prettier',
    'prettier/react',
  ],
  plugins: [
    'react',
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
  },
};
