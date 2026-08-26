/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  // jsdom makes Jest resolve package "exports" via the 'browser' condition, which
  // msw's dependency tree (@mswjs/interceptors) blocks on purpose for its node-only
  // subpaths — swap it for the plain Node condition set instead.
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },
  // MUI, emotion, react-virtuoso, hookform, zod, and msw's rettime dep all ship as ESM — transform them through babel.
  // `\.pnpm` must always be allowed through: pnpm nests real packages under
  // node_modules/.pnpm/<pkg>@<version>/node_modules/<pkg>/..., so the path has a second
  // /node_modules/ segment — without this, the first segment's lookahead fails on ".pnpm"
  // and the file is skipped before the real package name is ever checked.
  transformIgnorePatterns: [
    '/node_modules/(?!(\\.pnpm|@mui|@emotion|react-virtuoso|@hookform|zod|rettime|until-async|@open-draft)/)',
  ],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    // msw's package "exports" point Jest at its ESM (.mjs) build, which Jest can't
    // execute — pin these two entry points to msw's plain CJS build instead.
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
    '^msw$': '<rootDir>/node_modules/msw/lib/core/index.js',
  },
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
}
