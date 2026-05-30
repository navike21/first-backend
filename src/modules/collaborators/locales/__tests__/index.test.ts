import { describe, it, expect } from 'vitest';
import { collaboratorsLocales } from '@Modules/collaborators/locales/index';

describe('collaboratorsLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(collaboratorsLocales).toBeDefined();
		expect(typeof collaboratorsLocales).toBe('object');
		expect(collaboratorsLocales.en).toBeDefined();
		expect(collaboratorsLocales.es).toBeDefined();
		expect(collaboratorsLocales.de).toBeDefined();
		expect(collaboratorsLocales.fr).toBeDefined();
		expect(collaboratorsLocales.it).toBeDefined();
		expect(collaboratorsLocales.ja).toBeDefined();
		expect(collaboratorsLocales.ko).toBeDefined();
		expect(collaboratorsLocales.pt).toBeDefined();
		expect(collaboratorsLocales.ru).toBeDefined();
		expect(collaboratorsLocales.zh).toBeDefined();
	});
});
