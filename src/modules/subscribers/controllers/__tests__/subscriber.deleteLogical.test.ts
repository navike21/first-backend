import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/subscribers/application/deleteSubscriberLogical', () => ({ deleteSubscriberLogical: vi.fn() }));

import { subscriberDeleteLogical } from '@Modules/subscribers/controllers/subscriber.deleteLogical';
import { deleteSubscriberLogical } from '@Modules/subscribers/application/deleteSubscriberLogical';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
  return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('subscriberDeleteLogical', () => {
  it('calls deleteSubscriberLogical and returns success', async () => {
    vi.mocked(deleteSubscriberLogical).mockResolvedValue({ id: '1' } as never);
    const req = { params: { id: '1' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await subscriberDeleteLogical(req, res, next);
    expect(deleteSubscriberLogical).toHaveBeenCalledWith('1');
    expect(successResponse).toHaveBeenCalled();
  });
});
