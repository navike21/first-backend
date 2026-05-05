import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/subscribers/application/registerSubscriberBulk', () => ({ registerSubscriberBulk: vi.fn() }));

import { subscriberRegisterBulk } from '@Modules/subscribers/controllers/subscriber.registerBulk';
import { registerSubscriberBulk } from '@Modules/subscribers/application/registerSubscriberBulk';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
  return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('subscriberRegisterBulk', () => {
  it('calls registerSubscriberBulk with valid array body', async () => {
    vi.mocked(registerSubscriberBulk).mockResolvedValue([{ id: '1' }] as never);
    const req = { body: [{ firstName: 'John' }] } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await subscriberRegisterBulk(req, res, next);
    expect(registerSubscriberBulk).toHaveBeenCalledWith([{ firstName: 'John' }]);
    expect(successResponse).toHaveBeenCalled();
  });

  it('calls next with error when body is not an array', async () => {
    const req = { body: {} } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await subscriberRegisterBulk(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('calls next with error when body is an empty array', async () => {
    const req = { body: [] } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await subscriberRegisterBulk(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
