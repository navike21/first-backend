import { describe, it, expect } from 'vitest';
import { PILLARS, PILLARS_ARRAY } from '@Modules/services/constants/pillars';

describe('pillars constants', () => {
	it('PILLARS contains all expected pillars', () => {
		expect(PILLARS).toContain('responsibility');
		expect(PILLARS).toContain('people');
		expect(PILLARS).toContain('continuous-learning');
		expect(PILLARS).toContain('tech-adaptation');
		expect(PILLARS).toContain('digital-experience');
		expect(PILLARS).toContain('business-growth');
	});

	it('PILLARS_ARRAY matches PILLARS', () => {
		expect(PILLARS_ARRAY).toEqual([...PILLARS]);
	});
});
