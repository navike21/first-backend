import { describe, it, expect } from 'vitest';
import {
	resolveEffectiveStatus,
	publicVisibilityFilter,
} from '@Modules/blog/application/blogPostStatus';

describe('resolveEffectiveStatus', () => {
	it('returns published as-is', () => {
		expect(resolveEffectiveStatus({ status: 'published' })).toBe('published');
	});

	it('returns draft as-is', () => {
		expect(resolveEffectiveStatus({ status: 'draft' })).toBe('draft');
	});

	it('treats a scheduled post whose date has passed as published', () => {
		const past = new Date(Date.now() - 60_000);
		expect(
			resolveEffectiveStatus({ status: 'scheduled', scheduledAt: past }),
		).toBe('published');
	});

	it('keeps a scheduled post whose date is in the future as scheduled', () => {
		const future = new Date(Date.now() + 60_000);
		expect(
			resolveEffectiveStatus({ status: 'scheduled', scheduledAt: future }),
		).toBe('scheduled');
	});

	it('keeps scheduled status when scheduledAt is missing', () => {
		expect(resolveEffectiveStatus({ status: 'scheduled' })).toBe('scheduled');
	});
});

describe('publicVisibilityFilter', () => {
	it('matches published posts or due scheduled posts, excluding deleted ones', () => {
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
