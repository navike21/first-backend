import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/subscribers/application/updateSubscriber', () => ({ updateSubscriber: vi.fn() }));

import { subscriberUpdate } from '@Modules/subscribers/controllers/subscriber.update';
import { updateSubscriber } from '@Modules/subscribers/application/updateSubscriber';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
  return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('subscriberUpdate', () => {
  it('calls updateSubscriber with id and body', async () => {
    vi.mocked(updateSubscriber).mockResolvedValue({ id: '1', firstName: 'Jane' } as never);
    const req = { params: { id: '1' }, body: { firstName: 'Jane' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await subscriberUpdate(req, res, next);
    expect(updateSubscriber).toHaveBeenCalledWith('1', { firstName: 'Jane' });
    expect(successResponse).toHaveBeenCalled();
  });
});
