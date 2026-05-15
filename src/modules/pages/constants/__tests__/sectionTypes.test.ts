import { describe, it, expect } from 'vitest';
import { SECTION_TYPES } from '@Modules/pages/constants/sectionTypes';

describe('sectionTypes constant', () => {
	it('is a non-empty readonly array', () => {
		expect(Array.isArray(SECTION_TYPES)).toBe(true);
		expect(SECTION_TYPES.length).toBeGreaterThan(0);
	});

	it('includes core section types', () => {
		expect(SECTION_TYPES).toContain('hero');
		expect(SECTION_TYPES).toContain('gallery');
		expect(SECTION_TYPES).toContain('testimonials');
		expect(SECTION_TYPES).toContain('columns');
		expect(SECTION_TYPES).toContain('richtext');
	});
});
