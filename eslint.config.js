const eslint = require('@eslint/js');
const angular = require('angular-eslint');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'node_modules/**'
    ],
    linterOptions: {
      reportUnusedDisableDirectives: false
    }
  },
  {
    files: ['src/**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022
      }
    },
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case'
        }
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase'
        }
      ],
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-standalone': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-case-declarations': 'off',
      'no-extra-boolean-cast': 'off',
      'no-prototype-builtins': 'off',
      'no-useless-assignment': 'off'
    }
  },
  {
    files: ['src/**/*.html'],
    extends: [
      ...angular.configs.templateRecommended
    ],
    rules: {
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off'
    }
  }
);