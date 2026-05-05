import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { validateSchema } from '@Modules/subscribers/middlewares/validateSchema';
import { SubscriberRegisterSchema } from '@Modules/subscribers/schemas/subscriber.schema';

const validBody = {
  firstName: 'John',
  lastName: 'Doe',
  contactInformation: { email: 'john@example.com' },
  personalInformation: { gender: 'male' },
};

describe('validateSchema', () => {
  it('converts dateOfBirth ISO string to Date and calls next', () => {
    const middleware = validateSchema(SubscriberRegisterSchema);
    const req = {
      body: {
        ...validBody,
        personalInformation: {
          ...validBody.personalInformation,
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

  it('calls next when no dateOfBirth is provided', () => {
    const middleware = validateSchema(SubscriberRegisterSchema);
    const req = { body: { ...validBody } } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('calls next with error on invalid body', () => {
    const middleware = validateSchema(SubscriberRegisterSchema);
    const req = { body: {} } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    expect(() => middleware(req, res, next)).toThrow();
  });
});
