import { z } from 'zod';
import { LocalizedStringSchema } from '@Shared/schemas/localizedString.schema';
import { PORTFOLIO_STATUSES_ARRAY } from '../constants/portfolioStatus';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const MetricSchema = z.object({
	label: LocalizedStringSchema,
	value: z.string().min(1).max(100),
});

const TestimonialSchema = z.object({
	quote: LocalizedStringSchema,
	authorName: z.string().min(2).max(100).trim(),
	authorPosition: z.string().max(100).trim().optional(),
});

export const CreatePortfolioSchema = z.object({
	slug: z
		.string()
		.regex(slugRegex, { message: 'PORTFOLIO_SLUG_INVALID' })
		.max(150)
		.optional(),

	name: LocalizedStringSchema,
	shortDescription: LocalizedStringSchema,
	description: LocalizedStringSchema,

	// Optional at the schema level so a multipart create can supply it via an
	// uploaded `cover` file. createPortfolio enforces that a cover (file or URL)
	// is effectively present.
	coverImageUrl: z
		.url({ message: 'PORTFOLIO_COVER_IMAGE_URL_INVALID' })
		.optional(),
	gallery: z
		.array(z.url({ message: 'PORTFOLIO_GALLERY_URL_INVALID' }))
		.default([]),

	clientId: z.uuid({ message: 'PORTFOLIO_CLIENT_ID_INVALID' }).optional(),
	serviceIds: z
		.array(z.uuid({ message: 'PORTFOLIO_SERVICE_ID_INVALID' }))
		.min(1, { message: 'PORTFOLIO_SERVICE_REQUIRED' }),

	technologies: z.array(z.string().max(50)).default([]),
	projectUrl: z.url({ message: 'PORTFOLIO_PROJECT_URL_INVALID' }).optional(),

	startDate: z.iso.date('PORTFOLIO_START_DATE_INVALID'),

	endDate: z.iso.date('PORTFOLIO_END_DATE_INVALID').optional(),

	featured: z.boolean().default(false),
	order: z.coerce.number().int().default(0),

	testimonial: TestimonialSchema.optional(),
	metrics: z.array(MetricSchema).default([]),

	status: z.enum(PORTFOLIO_STATUSES_ARRAY).default('draft'),
});

export const UpdatePortfolioSchema = CreatePortfolioSchema.partial();

export const ListPortfolioQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	featured: z.coerce.boolean().optional(),
});

export const ListPortfolioAdminQuerySchema = ListPortfolioQuerySchema.extend({
	status: z.enum(PORTFOLIO_STATUSES_ARRAY).optional(),
});

export type CreatePortfolioInput = z.infer<typeof CreatePortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof UpdatePortfolioSchema>;
export type ListPortfolioQuery = z.infer<typeof ListPortfolioQuerySchema>;
export type ListPortfolioAdminQuery = z.infer<
	typeof ListPortfolioAdminQuerySchema
>;
