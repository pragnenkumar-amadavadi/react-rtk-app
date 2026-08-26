/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  // MUI, emotion, react-virtuoso, hookform, and zod all ship as ESM — transform them through babel.
  // `\.pnpm` must always be allowed through: pnpm nests real packages under
  // node_modules/.pnpm/<pkg>@<version>/node_modules/<pkg>/..., so the path has a second
  // /node_modules/ segment — without this, the first segment's lookahead fails on ".pnpm"
  // and the file is skipped before the real package name is ever checked.
  transformIgnorePatterns: [
    '/node_modules/(?!(\\.pnpm|@mui|@emotion|react-virtuoso|@hookform|zod)/)',
  ],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
}
