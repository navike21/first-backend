import { describe, it, expect } from 'vitest';
import {
	resolveEffectiveStatus,
	withEffectiveStatus,
	publicVisibilityFilter,
} from '@Modules/pages/application/pageStatus';

describe('resolveEffectiveStatus', () => {
	it('returns published as-is', () => {
		expect(resolveEffectiveStatus({ status: 'published' })).toBe('published');
	});

	it('returns draft as-is', () => {
		expect(resolveEffectiveStatus({ status: 'draft' })).toBe('draft');
	});

	it('treats a scheduled page whose date has passed as published', () => {
		const past = new Date(Date.now() - 60_000);
		expect(
			resolveEffectiveStatus({ status: 'scheduled', scheduledAt: past }),
		).toBe('published');
	});

	it('keeps a scheduled page whose date is in the future as scheduled', () => {
		const future = new Date(Date.now() + 60_000);
		expect(
			resolveEffectiveStatus({ status: 'scheduled', scheduledAt: future }),
		).toBe('scheduled');
	});

	it('keeps scheduled status when scheduledAt is missing', () => {
		expect(resolveEffectiveStatus({ status: 'scheduled' })).toBe('scheduled');
	});
});

describe('withEffectiveStatus', () => {
	it('attaches the computed effectiveStatus alongside the original fields', () => {
		const past = new Date(Date.now() - 1000);
		const result = withEffectiveStatus({
			id: '1',
			status: 'scheduled',
			scheduledAt: past,
		});
		expect(result.id).toBe('1');
		expect(result.status).toBe('scheduled');
		expect(result.effectiveStatus).toBe('published');
	});
});

describe('publicVisibilityFilter', () => {
	it('matches published pages or due scheduled pages, excluding deleted ones', () => {
		const filter = publicVisibilityFilter();
		expect(filter.deletedAt).toBeNull();
		expect(filter.$or).toEqual([
			{ status: 'published' },
			{
				status: 'scheduled',
				scheduledAt: expect.objectContaining({ $lte: expect.any(Date) }),
			},
		]);
	});
});
