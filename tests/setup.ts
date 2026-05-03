import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';

process.env.NODE_ENV = 'test';

beforeAll(() => {
  // Silence noisy logs in tests
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});
