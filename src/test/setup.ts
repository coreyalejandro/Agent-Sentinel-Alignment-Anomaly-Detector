import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock environment variables
process.env.VITE_GEMINI_API_KEY = 'test-gemini-key';
process.env.VITE_GROQ_API_KEY = 'test-groq-key';
process.env.VITE_APP_ENVIRONMENT = 'test';

// Mock File System Access API
Object.defineProperty(window, 'showDirectoryPicker', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, 'showOpenFilePicker', {
  writable: true,
  value: jest.fn(),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suppress console warnings in tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('React Router')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});