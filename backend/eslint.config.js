// eslint.config.js
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
  globalIgnores(['types/', 'dist/', 'node_modules/', 'admin/', 'database/', 'public/']),
  prettierRecommended,
  {
    rules: {}
  }
])
