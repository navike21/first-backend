import { describe, it, expect } from 'vitest';
import {
  SUBSCRIBER_PATH_REGISTER,
  SUBSCRIBER_PATH_REGISTER_BULK,
  SUBSCRIBER_PATH_LIST,
  SUBSCRIBER_PATH_SEARCH_BY_ID,
  SUBSCRIBER_PATH_UPDATE,
  SUBSCRIBER_PATH_DELETE,
  SUBSCRIBER_PATH_DELETE_BULK,
  SUBSCRIBER_PATH_DELETE_LOGIC,
  SUBSCRIBER_PATH_DELETE_LOGIC_BULK,
} from '@Modules/subscribers/constants/paths';

describe('subscriber paths', () => {
  it('exports all path constants', () => {
    expect(SUBSCRIBER_PATH_REGISTER).toBeDefined();
    expect(SUBSCRIBER_PATH_REGISTER_BULK).toBeDefined();
    expect(SUBSCRIBER_PATH_LIST).toBeDefined();
    expect(SUBSCRIBER_PATH_SEARCH_BY_ID).toBeDefined();
    expect(SUBSCRIBER_PATH_UPDATE).toBeDefined();
    expect(SUBSCRIBER_PATH_DELETE).toBeDefined();
    expect(SUBSCRIBER_PATH_DELETE_BULK).toBeDefined();
    expect(SUBSCRIBER_PATH_DELETE_LOGIC).toBeDefined();
    expect(SUBSCRIBER_PATH_DELETE_LOGIC_BULK).toBeDefined();
  });
});
