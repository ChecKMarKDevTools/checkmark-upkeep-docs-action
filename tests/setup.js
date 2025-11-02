/**
 * Vitest setup file for Upkeep Docs GitHub Action tests
 */

// Global test setup
global.console = {
  ...console,
  // Suppress console output during tests unless needed
  log: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

// Mock environment variables
process.env.NODE_ENV = 'test';
