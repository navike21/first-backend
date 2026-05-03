import { describe, it, expect } from 'vitest';
import { urlValidate } from '../../../src/helpers/urlValidate';

describe('urlValidate', () => {
  it('validates http URL', () => {
    expect(urlValidate('http://example.com')).toBe(true);
  });
  it('validates https URL', () => {
    expect(urlValidate('https://example.com/path')).toBe(true);
  });
  it('invalid URL', () => {
    expect(urlValidate('not-a-url')).toBe(false);
  });
});
