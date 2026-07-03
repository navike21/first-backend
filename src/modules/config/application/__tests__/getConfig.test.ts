import { describe, it, expect } from 'vitest';
import { getConfig } from '../getConfig';

describe('getConfig', () => {
	it('returns only the requested groups', () => {
		const result = getConfig(['currencies'], 'es');
		expect(result.currencies).toBeDefined();
		expect(result.industries).toBeUndefined();
		expect(result.documentTypes).toBeUndefined();
	});

	it('ignores unknown groups', () => {
		const result = getConfig(['nope', 'languages'], 'en');
		expect(result.languages).toBeDefined();
		expect(Object.keys(result)).toEqual(['languages']);
	});

	it('resolves labels to the requested language (es), falling back to en', () => {
		const es = getConfig(['currencies'], 'es').currencies as {
			value: string;
			label: string;
		}[];
		const en = getConfig(['currencies'], 'en').currencies as {
			value: string;
			label: string;
		}[];
		const de = getConfig(['currencies'], 'de').currencies as {
			value: string;
			label: string;
		}[];
		expect(es.find((c) => c.value === 'PEN')?.label).toBe('Soles');
		expect(en.find((c) => c.value === 'PEN')?.label).toBe('Peruvian Sol');
		// Non es/en falls back to English.
		expect(de.find((c) => c.value === 'PEN')?.label).toBe('Peruvian Sol');
	});

	it('exposes the DNI/RUC validation patterns', () => {
		const docs = getConfig(['documentTypes'], 'es').documentTypes as {
			value: string;
			pattern?: string;
		}[];
		expect(docs.find((d) => d.value === 'DNI')?.pattern).toBe('^\\d{8}$');
		expect(docs.find((d) => d.value === 'RUC')?.pattern).toBe('^\\d{11}$');
	});
});
