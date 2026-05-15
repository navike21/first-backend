import { beforeAll, afterAll, afterEach, vi } from 'vitest';

process.env.NODE_ENV = 'test';
// Satisfy environments.ts schema so tests that import modules with transitive
// ENV dependencies don't call process.exit(1). withMongo() overrides the actual connection.
process.env.MONGO_URI = process.env.MONGO_URI ?? 'mongodb://test-placeholder/ignored';
process.env.MONGO_DATABASE = process.env.MONGO_DATABASE ?? 'test';

beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});
