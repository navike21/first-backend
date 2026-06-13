import { describe, it, expect } from 'vitest';
import {
	PORTFOLIO_STATUSES,
	PORTFOLIO_STATUSES_ARRAY,
} from '@Modules/portfolio/constants/portfolioStatus';

describe('portfolioStatus constants', () => {
	it('PORTFOLIO_STATUSES contains all statuses', () => {
		// Lifecycle statuses only; deletion is tracked separately via deletedAt.
		expect(PORTFOLIO_STATUSES).toContain('draft');
		expect(PORTFOLIO_STATUSES).toContain('published');
		expect(PORTFOLIO_STATUSES).toContain('archived');
	});

	it('PORTFOLIO_STATUSES_ARRAY matches PORTFOLIO_STATUSES', () => {
		expect(PORTFOLIO_STATUSES_ARRAY).toEqual([...PORTFOLIO_STATUSES]);
	});
});
