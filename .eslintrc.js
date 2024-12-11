module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  ignorePatterns: ['bundle.js'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-param-reassign': [2, { props: false }],
    'no-underscore-dangle': ['error', { allow: ['_outputVideoPath', '_outputVideoContentType'] }],
  },
};
