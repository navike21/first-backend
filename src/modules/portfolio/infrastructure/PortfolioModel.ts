import { model, Schema } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';
import { PORTFOLIO_STATUSES_ARRAY } from '../constants/portfolioStatus';
import type { LocalizedString } from '@Shared/types/localizedString';

export interface PortfolioTestimonial {
	quote: LocalizedString;
	authorName: string;
	authorPosition?: string;
}

export interface PortfolioMetric {
	label: LocalizedString;
	value: string;
}

export interface PortfolioDocument {
	id: string;
	slug: string;
	name: LocalizedString;
	shortDescription: LocalizedString;
	description: LocalizedString;
	coverImageUrl: string;
	gallery: string[];
	clientId?: string;
	serviceIds: string[];
	technologies: string[];
	projectUrl?: string;
	startDate: string;
	endDate?: string;
	featured: boolean;
	order: number;
	testimonial?: PortfolioTestimonial;
	metrics: PortfolioMetric[];
	status: string;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const portfolioSchema = new Schema<PortfolioDocument>(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		slug: { type: String, required: true, unique: true, lowercase: true },
		name: { type: localizedStringType, required: true },
		shortDescription: { type: localizedStringType, required: true },
		description: { type: localizedStringType, required: true },
		coverImageUrl: { type: String, required: true },
		gallery: [{ type: String }],
		clientId: { type: String },
		serviceIds: [{ type: String, required: true }],
		technologies: [{ type: String }],
		projectUrl: { type: String },
		startDate: { type: String, required: true },
		endDate: { type: String },
		featured: { type: Boolean, default: false },
		order: { type: Number, default: 0 },
		testimonial: {
			type: {
				quote: { type: localizedStringType, required: true },
				authorName: { type: String, required: true },
				authorPosition: { type: String },
			},
			required: false,
		},
		metrics: [
			{
				label: { type: localizedStringType, required: true },
				value: { type: String, required: true },
			},
		],
		status: {
			type: String,
			required: true,
			default: 'draft',
			enum: PORTFOLIO_STATUSES_ARRAY,
		},
		deletedAt: { type: Date },
	},
	{ timestamps: true },
);

portfolioSchema.index({ slug: 1 }, { unique: true });
portfolioSchema.index({ status: 1, featured: -1, order: 1 });
portfolioSchema.index({ serviceIds: 1, status: 1 });
portfolioSchema.index({ clientId: 1 });

export default model<PortfolioDocument>('Portfolio', portfolioSchema);
