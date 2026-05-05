import { describe, it, expect } from 'vitest';
import { SubscriberRegisterSchema } from '@Modules/subscribers/schemas/subscriber.schema';

const validData = {
  firstName: 'John',
  lastName: 'Doe',
  contactInformation: { email: 'john@example.com' },
  personalInformation: { gender: 'male' as const },
};

describe('SubscriberRegisterSchema', () => {
  it('parses valid subscriber data', () => {
    const result = SubscriberRegisterSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects missing firstName', () => {
    const result = SubscriberRegisterSchema.safeParse({
      ...validData,
      firstName: undefined,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = SubscriberRegisterSchema.safeParse({
      ...validData,
      contactInformation: { email: 'bad-email' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid personalInformation value', () => {
    const result = SubscriberRegisterSchema.safeParse({
      ...validData,
      personalInformation: { gender: 'invalid-gender' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing personalInformation', () => {
    const result = SubscriberRegisterSchema.safeParse({
      ...validData,
      personalInformation: undefined,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing contactInformation', () => {
    const result = SubscriberRegisterSchema.safeParse({
      ...validData,
      contactInformation: undefined,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid contactInformation value', () => {
    const result = SubscriberRegisterSchema.safeParse({
      ...validData,
      contactInformation: { email: 123 },
    });
    expect(result.success).toBe(false);
  });

  it('triggers INVALID error branches for non-undefined wrong-type inputs', () => {
    const result = SubscriberRegisterSchema.safeParse({
      firstName: 123,
      lastName: 456,
      contactInformation: 789,
      personalInformation: { gender: 999 },
    });
    expect(result.success).toBe(false);
  });

  it('triggers INVALID branch for non-object personalInformation', () => {
    const result = SubscriberRegisterSchema.safeParse({
      ...validData,
      personalInformation: 999,
    });
    expect(result.success).toBe(false);
  });

  it('triggers REQUIRED branches for missing nested required fields', () => {
    const r1 = SubscriberRegisterSchema.safeParse({
      ...validData,
      contactInformation: {},
    });
    expect(r1.success).toBe(false);

    const r2 = SubscriberRegisterSchema.safeParse({
      ...validData,
      personalInformation: {},
    });
    expect(r2.success).toBe(false);
  });
});
