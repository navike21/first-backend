import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { validateSchemaArray } from '@Modules/subscribers/middlewares/validateSchemaArray';
import { SubscriberRegisterSchema } from '@Modules/subscribers/schemas/subscriber.schema';

const validItem = {
  firstName: 'John',
  lastName: 'Doe',
  contactInformation: { email: 'john@example.com' },
  personalInformation: { gender: 'male' },
};

describe('validateSchemaArray', () => {
  it('calls next with error when body is not an array', () => {
    const middleware = validateSchemaArray(SubscriberRegisterSchema);
    const req = { body: {} } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    expect(() => middleware(req, res, next)).toThrow();
  });

  it('transforms dates and calls next for valid array', () => {
    const middleware = validateSchemaArray(SubscriberRegisterSchema);
    const req = {
      body: [
        {
          ...validItem,
          personalInformation: {
            ...validItem.personalInformation,
            dateOfBirth: '1990-01-15T00:00:00.000Z',
          },
        },
      ],
    } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body[0].personalInformation.dateOfBirth).toBeInstanceOf(Date);
  });

  it('calls next with error on invalid array items', () => {
    const middleware = validateSchemaArray(SubscriberRegisterSchema);
    const req = { body: [{ firstName: 'X' }] } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    expect(() => middleware(req, res, next)).toThrow();
  });
});
