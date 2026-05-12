import { describe, it, expect } from 'vitest';
import {
	DOCUMENT_TYPES,
	DOCUMENT_TYPES_ARRAY,
} from '@Modules/clients/constants/documentTypes';

describe('documentTypes constants', () => {
	it('DOCUMENT_TYPES contains expected entries', () => {
		expect(DOCUMENT_TYPES).toContain('DNI');
		expect(DOCUMENT_TYPES).toContain('RUC');
		expect(DOCUMENT_TYPES).toContain('PASSPORT');
		expect(DOCUMENT_TYPES).toContain('OTHER');
	});

	it('DOCUMENT_TYPES_ARRAY matches DOCUMENT_TYPES', () => {
		expect(DOCUMENT_TYPES_ARRAY).toEqual([...DOCUMENT_TYPES]);
	});
});
