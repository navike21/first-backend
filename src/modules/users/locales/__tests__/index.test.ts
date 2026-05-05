import { describe, it, expect } from 'vitest';
import { usersLocales } from '@Modules/users/locales/index';

describe('usersLocales', () => {
  it('exports an object with locale keys', () => {
    expect(usersLocales).toBeDefined();
    expect(typeof usersLocales).toBe('object');
    expect(usersLocales.en).toBeDefined();
    expect(usersLocales.es).toBeDefined();
  });
});
