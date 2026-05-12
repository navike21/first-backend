import { model, Schema } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';
import { PILLARS_ARRAY } from '../constants/pillars';
import type { LocalizedString } from '@Shared/types/localizedString';
import type { Pillar } from '../constants/pillars';

export interface ServiceDocument {
	id: string;
	slug: string;
	name: LocalizedString;
	shortDescription: LocalizedString;
	description: LocalizedString;
	icon?: string;
	coverImageUrl?: string;
	pillars: Pillar[];
	highlights: LocalizedString[];
	tags: string[];
	order: number;
	isActive: boolean;
	status: string;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const serviceSchema = new Schema<ServiceDocument>(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		slug: { type: String, required: true, unique: true, lowercase: true },
		name: { type: localizedStringType, required: true },
		shortDescription: { type: localizedStringType, required: true },
		description: { type: localizedStringType, required: true },
		icon: { type: String },
		coverImageUrl: { type: String },
		pillars: [{ type: String, enum: PILLARS_ARRAY }],
		highlights: [{ type: localizedStringType }],
		tags: [{ type: String }],
		order: { type: Number, default: 0 },
		isActive: { type: Boolean, default: true },
		status: {
			type: String,
			required: true,
			default: 'active',
			enum: ['active', 'deleted'],
		},
		deletedAt: { type: Date },
	},
	{ timestamps: true },
);

serviceSchema.index({ slug: 1 }, { unique: true });
serviceSchema.index({ isActive: 1, order: 1 });

export default model<ServiceDocument>('Service', serviceSchema);
