import { describe, it, expect } from 'vitest';
import { userGroupsLocales } from '@Modules/user-groups/locales/index';

describe('userGroupsLocales', () => {
  it('exports an object with locale keys', () => {
    expect(userGroupsLocales).toBeDefined();
    expect(typeof userGroupsLocales).toBe('object');
    expect(userGroupsLocales.en).toBeDefined();
    expect(userGroupsLocales.es).toBeDefined();
  });
});
