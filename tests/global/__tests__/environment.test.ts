import { describe, it, expect } from 'vitest';

describe('Environment', () => {
  it('should run in test environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
