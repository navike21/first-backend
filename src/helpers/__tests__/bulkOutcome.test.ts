import { describe, it, expect } from 'vitest';
import { bulkOutcome } from '@Helpers/bulkOutcome';

describe('bulkOutcome', () => {
	it('returns NONE when nothing was processed', () => {
		expect(bulkOutcome({ processedIds: [], notFoundIds: ['a', 'b'] })).toBe(
			'NONE',
		);
	});

	it('returns PARTIAL when some ids were processed and some were not found', () => {
		expect(bulkOutcome({ processedIds: ['a'], notFoundIds: ['b'] })).toBe(
			'PARTIAL',
		);
	});

	it('returns SUCCESS when all ids were processed', () => {
		expect(bulkOutcome({ processedIds: ['a', 'b'], notFoundIds: [] })).toBe(
			'SUCCESS',
		);
	});
});
