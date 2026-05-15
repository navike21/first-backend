import { describe, it, expect } from 'vitest';
import {
	PORTFOLIO_STATUSES,
	PORTFOLIO_STATUSES_ARRAY,
} from '@Modules/portfolio/constants/portfolioStatus';

describe('portfolioStatus constants', () => {
	it('PORTFOLIO_STATUSES contains all statuses', () => {
		expect(PORTFOLIO_STATUSES).toContain('draft');
		expect(PORTFOLIO_STATUSES).toContain('published');
		expect(PORTFOLIO_STATUSES).toContain('archived');
		expect(PORTFOLIO_STATUSES).toContain('deleted');
	});

	it('PORTFOLIO_STATUSES_ARRAY matches PORTFOLIO_STATUSES', () => {
		expect(PORTFOLIO_STATUSES_ARRAY).toEqual([...PORTFOLIO_STATUSES]);
	});
});
