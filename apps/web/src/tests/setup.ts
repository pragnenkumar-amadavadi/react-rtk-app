import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'node:util'
import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web'
import { BroadcastChannel } from 'node:worker_threads'

// react-router v7 uses TextEncoder at module load time; jsdom doesn't provide it
Object.assign(global, { TextEncoder, TextDecoder })

// jsdom has no Fetch API globals; msw/node needs them to intercept requests in tests
Object.assign(global, { ReadableStream, TransformStream, WritableStream })
Object.assign(global, { BroadcastChannel })

// undici reads the global TextEncoder at its own module-load time, so it must be
// required after the assignment above — a static import would evaluate too early.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { fetch, Headers, FormData, Request, Response } = require('undici')
Object.assign(global, { fetch, Headers, FormData, Request, Response })

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(),
}))
