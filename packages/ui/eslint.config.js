import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';
import sharedConfig from '@repo/eslint-config';

export default defineConfig([
  globalIgnores(['storybook-static']),
  ...sharedConfig,
  ...storybook.configs['flat/recommended'],
]);
