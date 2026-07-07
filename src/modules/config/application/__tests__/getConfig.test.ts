import { describe, it, expect } from 'vitest';
import { getConfig } from '../getConfig';

describe('getConfig', () => {
	it('returns only the requested groups', () => {
		const result = getConfig(['currencies'], 'es');
		expect(result.currencies).toBeDefined();
		expect(result.industries).toBeUndefined();
		expect(result.documentTypes).toBeUndefined();
		expect(result.clientTypes).toBeUndefined();
		expect(result.genders).toBeUndefined();
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

	it('returns language names localized to the requested language (not endonyms)', () => {
		const es = getConfig(['languages'], 'es').languages as { value: string; label: string }[];
		const en = getConfig(['languages'], 'en').languages as { value: string; label: string }[];
		const ja = getConfig(['languages'], 'ja').languages as { value: string; label: string }[];
		// In Spanish UI: "inglés", "español", "chino"
		expect(es.find((l) => l.value === 'en')?.label?.toLowerCase()).toContain('ingl');
		expect(es.find((l) => l.value === 'es')?.label?.toLowerCase()).toContain('español');
		expect(es.find((l) => l.value === 'zh')?.label?.toLowerCase()).toContain('chin');
		// In English UI: "English", "Spanish"
		expect(en.find((l) => l.value === 'en')?.label).toBe('English');
		expect(en.find((l) => l.value === 'es')?.label).toBe('Spanish');
		// In Japanese UI: shows CJK characters
		const jaEs = ja.find((l) => l.value === 'es')?.label ?? '';
		expect(jaEs.length).toBeGreaterThan(0);
	});

	it('returns clientTypes with localized labels', () => {
		const es = getConfig(['clientTypes'], 'es').clientTypes as { value: string; label: string }[];
		const en = getConfig(['clientTypes'], 'en').clientTypes as { value: string; label: string }[];
		const ja = getConfig(['clientTypes'], 'ja').clientTypes as { value: string; label: string }[];
		expect(es.find((c) => c.value === 'person')?.label).toBe('Persona');
		expect(es.find((c) => c.value === 'company')?.label).toBe('Empresa');
		expect(en.find((c) => c.value === 'person')?.label).toBe('Person');
		expect(en.find((c) => c.value === 'company')?.label).toBe('Company');
		expect(ja.find((c) => c.value === 'person')?.label).toBe('個人');
		expect(ja.find((c) => c.value === 'company')?.label).toBe('法人');
	});

	it('returns genders with localized labels', () => {
		const es = getConfig(['genders'], 'es').genders as { value: string; label: string }[];
		const en = getConfig(['genders'], 'en').genders as { value: string; label: string }[];
		const ko = getConfig(['genders'], 'ko').genders as { value: string; label: string }[];
		expect(es.find((g) => g.value === 'female')?.label).toBe('Femenino');
		expect(es.find((g) => g.value === 'prefer_not_to_say')?.label).toBe('Prefiero no decir');
		expect(en.find((g) => g.value === 'male')?.label).toBe('Male');
		expect(ko.find((g) => g.value === 'other')?.label).toBe('기타');
	});

	it('can fetch multiple groups in one call', () => {
		const result = getConfig(['clientTypes', 'genders', 'languages'], 'fr');
		expect(result.clientTypes).toBeDefined();
		expect(result.genders).toBeDefined();
		expect(result.languages).toBeDefined();
		expect(result.currencies).toBeUndefined();
	});

	it('returns technologies with language-agnostic labels', () => {
		const en = getConfig(['technologies'], 'en').technologies as { value: string; label: string }[];
		const es = getConfig(['technologies'], 'es').technologies as { value: string; label: string }[];
		expect(en.find((t) => t.value === 'react')?.label).toBe('React');
		expect(en.find((t) => t.value === 'nodejs')?.label).toBe('Node.js');
		expect(es.find((t) => t.value === 'react')?.label).toBe('React');
	});
});
