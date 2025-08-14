import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Ignores
  { ignores: ['node_modules', 'build', 'dist', '.svelte-kit', 'src/types/**/*.d.ts'] },

  // Core JS/TS configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Svelte support
  ...svelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        // Parse <script lang="ts"> with TS parser
        parser: tseslint.parser
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        HTMLInputElement: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly'
      }
    }
  },

  // Project-wide rule tweaks
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  },

  // Prettier last
  eslintConfigPrettier,
  ...svelte.configs['flat/prettier']
];

