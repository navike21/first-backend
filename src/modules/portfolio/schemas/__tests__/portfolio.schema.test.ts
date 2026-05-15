import { describe, it, expect } from 'vitest';
import {
	CreatePortfolioSchema,
	UpdatePortfolioSchema,
	ListPortfolioQuerySchema,
	ListPortfolioAdminQuerySchema,
} from '@Modules/portfolio/schemas/portfolio.schema';

const ls = {
	en: 'a',
	es: 'b',
	de: 'c',
	fr: 'd',
	it: 'e',
	ja: 'f',
	ko: 'g',
	pt: 'h',
	ru: 'i',
	zh: 'j',
};

const validPortfolio = {
	name: ls,
	shortDescription: ls,
	description: ls,
	coverImageUrl: 'https://example.com/cover.jpg',
	serviceIds: ['550e8400-e29b-41d4-a716-446655440000'],
	startDate: '2024-01-01',
};

describe('portfolio.schema', () => {
	it('CreatePortfolioSchema parses valid minimal data', () => {
		const result = CreatePortfolioSchema.safeParse(validPortfolio);
		expect(result.success).toBe(true);
	});

	it('CreatePortfolioSchema rejects missing coverImageUrl', () => {
		const { coverImageUrl: _, ...rest } = validPortfolio;
		const result = CreatePortfolioSchema.safeParse(rest);
		expect(result.success).toBe(false);
	});

	it('CreatePortfolioSchema rejects empty serviceIds', () => {
		const result = CreatePortfolioSchema.safeParse({
			...validPortfolio,
			serviceIds: [],
		});
		expect(result.success).toBe(false);
	});

	it('CreatePortfolioSchema rejects invalid slug format', () => {
		const result = CreatePortfolioSchema.safeParse({
			...validPortfolio,
			slug: 'Invalid Slug!',
		});
		expect(result.success).toBe(false);
	});

	it('CreatePortfolioSchema accepts valid testimonial', () => {
		const result = CreatePortfolioSchema.safeParse({
			...validPortfolio,
			testimonial: { quote: ls, authorName: 'John Doe' },
		});
		expect(result.success).toBe(true);
	});

	it('CreatePortfolioSchema accepts metrics', () => {
		const result = CreatePortfolioSchema.safeParse({
			...validPortfolio,
			metrics: [{ label: ls, value: '+50%' }],
		});
		expect(result.success).toBe(true);
	});

	it('UpdatePortfolioSchema allows empty object', () => {
		const result = UpdatePortfolioSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it('ListPortfolioQuerySchema defaults page and limit', () => {
		const result = ListPortfolioQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});

	it('ListPortfolioAdminQuerySchema accepts status filter', () => {
		const result = ListPortfolioAdminQuerySchema.safeParse({
			status: 'published',
		});
		expect(result.success).toBe(true);
	});

	it('ListPortfolioAdminQuerySchema rejects invalid status', () => {
		const result = ListPortfolioAdminQuerySchema.safeParse({
			status: 'invalid-status',
		});
		expect(result.success).toBe(false);
	});
});
