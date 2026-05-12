import { describe, it, expect } from 'vitest';
import {
	PORTFOLIO_PATH_LIST_PUBLIC,
	PORTFOLIO_PATH_LIST_ADMIN,
	PORTFOLIO_PATH_BY_SERVICE,
	PORTFOLIO_PATH_GET_BY_SLUG,
	PORTFOLIO_PATH_CREATE,
	PORTFOLIO_PATH_UPDATE,
	PORTFOLIO_PATH_DELETE,
} from '@Modules/portfolio/constants/paths';

describe('portfolio paths constants', () => {
	it('exports expected path strings', () => {
		expect(PORTFOLIO_PATH_LIST_PUBLIC).toBe('/portfolio');
		expect(PORTFOLIO_PATH_LIST_ADMIN).toBe('/portfolio/admin');
		expect(PORTFOLIO_PATH_BY_SERVICE).toBe('/portfolio/by-service/:serviceSlug');
		expect(PORTFOLIO_PATH_GET_BY_SLUG).toBe('/portfolio/:slug');
		expect(PORTFOLIO_PATH_CREATE).toBe('/portfolio');
		expect(PORTFOLIO_PATH_UPDATE).toBe('/portfolio/:id');
		expect(PORTFOLIO_PATH_DELETE).toBe('/portfolio/:id');
	});
});
