import { describe, it, expect } from 'vitest';
import { blogLocales } from '@Modules/blog/locales/index';

describe('blogLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(blogLocales).toBeDefined();
		expect(typeof blogLocales).toBe('object');
		expect(blogLocales.en).toBeDefined();
		expect(blogLocales.es).toBeDefined();
		expect(blogLocales.zh).toBeDefined();
	});
});
