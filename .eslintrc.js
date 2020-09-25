module.exports = {
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: [
        './**/*.ts',
        './**/*.js',
        './**/*.vue',
      ],
      excludedFiles: [
        'dist/**',
      ],
      plugins: [
        'html',
        'cypress',
        '@typescript-eslint',
      ],
      env: {
        'cypress/globals': true,
      },
      globals: {
        document: false,
        window: false,
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/strongly-recommended',
        'airbnb-base',
      ],
      rules: {
        semi: ['error', 'never'],
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
        'import/no-dynamic-require': 'off',
        'arrow-parens': ['error', 'as-needed'],
        'padded-blocks': 'off',
        'class-methods-use-this': 'off',
        'global-require': 'off',
        'func-names': ['error', 'never'],
        'arrow-body-style': 'off',
        'max-len': 'off',
        'vue/this-in-template': ['error', 'never'],
        'vue/max-attributes-per-line': ['error', {
          singleline: 3,
          multiline: {
            max: 1,
            allowFirstLine: false,
          },
        }],
        'no-param-reassign': 'off',
        'import/prefer-default-export': 'off',
        'consistent-return': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/explicit-module-boundary-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
}
