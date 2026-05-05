import { describe, it, expect } from 'vitest';
import { authLocales } from '@Modules/auth/locales/index';

describe('authLocales', () => {
  it('exports an object with locale keys', () => {
    expect(authLocales).toBeDefined();
    expect(typeof authLocales).toBe('object');
    expect(authLocales.en).toBeDefined();
    expect(authLocales.es).toBeDefined();
  });
});
