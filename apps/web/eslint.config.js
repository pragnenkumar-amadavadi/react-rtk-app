import { defineConfig, globalIgnores } from 'eslint/config';
import sharedConfig from '@repo/eslint-config';

export default defineConfig([
  globalIgnores(['dist', 'public/mockServiceWorker.js']),
  ...sharedConfig,
]);
