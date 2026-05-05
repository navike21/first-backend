import { describe, it, expect, vi } from 'vitest';

vi.mock('mongoose', async (importOriginal) => {
  const actual = await importOriginal<typeof import('mongoose')>();
  return {
    ...actual,
    model: vi.fn().mockReturnValue({ modelName: 'RefreshToken' }),
  };
});

import RefreshTokenModel from '@Modules/auth/infrastructure/RefreshTokenModel';

describe('RefreshTokenModel', () => {
  it('exports a model', () => {
    expect(RefreshTokenModel).toBeDefined();
  });
});
