import { describe, it, expect } from 'vitest';
import {
	CreateServiceSchema,
	UpdateServiceSchema,
	ListServicesQuerySchema,
} from '@Modules/services/schemas/service.schema';

const localizedStr = { en: 'a', es: 'b', de: 'c', fr: 'd', it: 'e', ja: 'f', ko: 'g', pt: 'h', ru: 'i', zh: 'j' };

const validService = {
	name: localizedStr,
	shortDescription: localizedStr,
	description: localizedStr,
};

describe('service.schema', () => {
	it('CreateServiceSchema parses valid data', () => {
		const result = CreateServiceSchema.safeParse(validService);
		expect(result.success).toBe(true);
	});

	it('CreateServiceSchema rejects missing name', () => {
		const result = CreateServiceSchema.safeParse({ shortDescription: localizedStr, description: localizedStr });
		expect(result.success).toBe(false);
	});

	it('CreateServiceSchema rejects invalid slug format', () => {
		const result = CreateServiceSchema.safeParse({ ...validService, slug: 'Invalid Slug!' });
		expect(result.success).toBe(false);
	});

	it('CreateServiceSchema accepts valid slug', () => {
		const result = CreateServiceSchema.safeParse({ ...validService, slug: 'valid-slug-123' });
		expect(result.success).toBe(true);
	});

	it('CreateServiceSchema rejects incomplete LocalizedString', () => {
		const result = CreateServiceSchema.safeParse({
			name: { en: 'only english' },
			shortDescription: localizedStr,
			description: localizedStr,
		});
		expect(result.success).toBe(false);
	});

	it('UpdateServiceSchema allows partial data', () => {
		const result = UpdateServiceSchema.safeParse({ isActive: false });
		expect(result.success).toBe(true);
	});

	it('ListServicesQuerySchema defaults page and limit', () => {
		const result = ListServicesQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});
});
