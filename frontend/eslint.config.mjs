// eslint.config.js
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['types/', 'dist/', 'node_modules/', 'admin/', 'database/', 'public/', '.nuxt']),
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    rules: {
      // You can add/override ESLint or TypeScript-ESLint rules here
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  }
])
