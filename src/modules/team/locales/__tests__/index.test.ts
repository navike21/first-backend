import { describe, it, expect } from 'vitest';
import { teamLocales } from '@Modules/team/locales/index';

describe('teamLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(teamLocales).toBeDefined();
		expect(typeof teamLocales).toBe('object');
		expect(teamLocales.en).toBeDefined();
		expect(teamLocales.es).toBeDefined();
		expect(teamLocales.de).toBeDefined();
		expect(teamLocales.fr).toBeDefined();
		expect(teamLocales.it).toBeDefined();
		expect(teamLocales.ja).toBeDefined();
		expect(teamLocales.ko).toBeDefined();
		expect(teamLocales.pt).toBeDefined();
		expect(teamLocales.ru).toBeDefined();
		expect(teamLocales.zh).toBeDefined();
	});
});
