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

	it('resolves labels to the requested language, falling back to en for unknown langs', () => {
		const es = getConfig(['currencies'], 'es').currencies as { value: string; label: string }[];
		const en = getConfig(['currencies'], 'en').currencies as { value: string; label: string }[];
		const de = getConfig(['currencies'], 'de').currencies as { value: string; label: string }[];
		const ja = getConfig(['currencies'], 'ja').currencies as { value: string; label: string }[];
		const ko = getConfig(['currencies'], 'ko').currencies as { value: string; label: string }[];
		const xx = getConfig(['currencies'], 'xx').currencies as { value: string; label: string }[];
		expect(es.find((c) => c.value === 'PEN')?.label).toBe('Soles');
		expect(en.find((c) => c.value === 'PEN')?.label).toBe('Peruvian Sol');
		expect(de.find((c) => c.value === 'PEN')?.label).toBe('Peruanischer Sol');
		expect(ja.find((c) => c.value === 'PEN')?.label).toBe('ペルーソル');
		expect(ko.find((c) => c.value === 'USD')?.label).toBe('미국 달러');
		// Truly unknown lang falls back to English.
		expect(xx.find((c) => c.value === 'PEN')?.label).toBe('Peruvian Sol');
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
