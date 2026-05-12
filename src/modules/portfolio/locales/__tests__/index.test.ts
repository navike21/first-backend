import { describe, it, expect } from 'vitest';
import { portfolioLocales } from '@Modules/portfolio/locales/index';

describe('portfolioLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(portfolioLocales).toBeDefined();
		expect(typeof portfolioLocales).toBe('object');
		expect(portfolioLocales.en).toBeDefined();
		expect(portfolioLocales.es).toBeDefined();
		expect(portfolioLocales.zh).toBeDefined();
	});
});
