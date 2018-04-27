'use strict';

module.exports = {
  extends: ['airbnb'],
  rules: {
    'class-methods-use-this': 0,
    'consistent-return': 0,
    'function-paren-newline': 0,
    'jsx-a11y/anchor-has-content': ['error', { components: [] }],
    // It does not work properly. Try again after updating.
    // 'jsx-a11y/label-has-for': ['error', { components: ['label'] }],
    'jsx-a11y/label-has-for': 0,
    'no-console': 0,
    'no-else-return': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': ['error', { 'allow': ['_id', '__STATE'] }],
    'object-curly-newline': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'react/no-array-index-key': 0,
    'react/prop-types': ['error', {
      ignore: [
        'children',
        'store',
      ],
      customValidators: []
    }],
    'react/require-default-props': 0,
    semi: ['error', 'always'],
  },
  parser: 'babel-eslint',
  env: {
    browser: true,
    mocha: true,
    node: true,
    es6: true,
  },
  globals: {
    web3: true,
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: [
          'node_modules',
          '.',
        ]
      }
    }
  }
};
