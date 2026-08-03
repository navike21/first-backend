import { describe, it, expect } from 'vitest';
import { getTranslationTransport } from '../getTranslationTransport';

describe('getTranslationTransport', () => {
	it('returns the anthropic transport (the only provider today)', () => {
		expect(getTranslationTransport().name).toBe('anthropic');
	});
});
