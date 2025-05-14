import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ['src/**/*.{ts,js}'],
    ignores: ['node_modules/**', 'dist/**', 'logs/**', '*.log', '.env'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 2021,
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
      import: importPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
      'no-unused-vars': 'off',
    },
  },
  eslintConfigPrettier,
];
