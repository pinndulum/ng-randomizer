const eslint = require('@eslint/js');
const angular = require('angular-eslint');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: [
      '.angular/**',
      'coverage/**',
      'dist/**',
      'node_modules/**'
    ],
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
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
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.es2022
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname
      },
      sourceType: 'module'
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
      '@angular-eslint/no-uncalled-signals': 'error',
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      '@angular-eslint/prefer-output-readonly': 'error',
      '@angular-eslint/prefer-signal-model': 'error',
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'linebreak-style': ['error', 'windows'],
      'no-case-declarations': 'error',
      'no-extra-boolean-cast': 'error',
      'no-prototype-builtins': 'error',
      'no-useless-assignment': 'error',
      'no-useless-constructor': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-const': 'error'
    }
  },
  {
    files: ['src/**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility
    ],
    rules: {
      '@angular-eslint/template/button-has-type': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/no-inline-styles': 'error',
      '@angular-eslint/template/prefer-class-binding': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error'
    }
  }
);
