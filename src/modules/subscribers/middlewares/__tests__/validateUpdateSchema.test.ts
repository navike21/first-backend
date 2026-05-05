import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { validateUpdateSchema } from '@Modules/subscribers/middlewares/validateUpdateSchema';
import { SubscriberUpdateSchema } from '@Modules/subscribers/schemas/subscriber.updateSchema';

describe('validateUpdateSchema', () => {
  it('converts dateOfBirth ISO string to Date when personalInformation is present', () => {
    const middleware = validateUpdateSchema(SubscriberUpdateSchema);
    const req = {
      body: {
        personalInformation: {
          gender: 'male',
          dateOfBirth: '1990-01-15T00:00:00.000Z',
        },
      },
    } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.personalInformation.dateOfBirth).toBeInstanceOf(Date);
  });

  it('passes undefined when personalInformation is absent', () => {
    const middleware = validateUpdateSchema(SubscriberUpdateSchema);
    const req = { body: { firstName: 'Jane' } } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('calls next with error on invalid body', () => {
    const middleware = validateUpdateSchema(SubscriberUpdateSchema);
    const req = {
      body: { firstName: 'X' },
    } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    expect(() => middleware(req, res, next)).toThrow();
  });

  it('keeps dateOfBirth as-is when it is not a valid ISO string', () => {
    const middleware = validateUpdateSchema(SubscriberUpdateSchema);
    const req = {
      body: {
        personalInformation: { gender: 'male', dateOfBirth: 'not-an-iso-string' },
      },
    } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    expect(() => middleware(req, res, next)).toThrow();
  });
});
