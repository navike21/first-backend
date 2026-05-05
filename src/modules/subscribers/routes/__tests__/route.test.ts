import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/subscribers/application/registerSubscriber', () => ({ registerSubscriber: vi.fn() }));
vi.mock('@Modules/subscribers/application/registerSubscriberBulk', () => ({ registerSubscriberBulk: vi.fn() }));
vi.mock('@Modules/subscribers/application/listAllSubscribers', () => ({ listAllSubscribers: vi.fn() }));
vi.mock('@Modules/subscribers/application/searchSubscriberById', () => ({ searchSubscriberById: vi.fn() }));
vi.mock('@Modules/subscribers/application/deleteSubscriberLogical', () => ({ deleteSubscriberLogical: vi.fn() }));
vi.mock('@Modules/subscribers/application/deleteSubscribersLogicalBulk', () => ({ deleteSubscribersLogicalBulk: vi.fn() }));
vi.mock('@Modules/subscribers/application/deleteSubscriber', () => ({ deleteSubscriber: vi.fn() }));
vi.mock('@Modules/subscribers/application/deleteSubscribersBulk', () => ({ deleteSubscribersBulk: vi.fn() }));
vi.mock('@Modules/subscribers/application/updateSubscriber', () => ({ updateSubscriber: vi.fn() }));

import { Router } from 'express';
import { subscribersApi } from '@Modules/subscribers/routes/route';

describe('subscribersApi route', () => {
  it('registers routes on the router', () => {
    const router = Router();
    expect(() => subscribersApi(router)).not.toThrow();
  });
});
