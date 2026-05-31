import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';
import { SECTION_TYPES } from '../constants/sectionTypes';

const SectionSettingsSchema = new Schema(
	{
		columns: { type: Number },
		background: { type: String },
		paddingTop: { type: String },
		paddingBottom: { type: String },
		fullWidth: { type: Boolean },
		customClass: { type: String },
	},
	{ _id: false },
);

const SectionSchema = new Schema(
	{
		sectionId: { type: String, default: generateUUID },
		type: { type: String, enum: SECTION_TYPES, required: true },
		order: { type: Number, default: 0 },
		settings: { type: SectionSettingsSchema },
		content: { type: Schema.Types.Mixed, default: {} },
	},
	{ _id: false },
);

const PageSchema = new Schema(
	{
		id: { type: String, default: generateUUID, index: true },
		slug: { type: String, required: true, unique: true, trim: true },
		title: localizedStringType,
		description: localizedStringType,
		sections: { type: [SectionSchema], default: [] },
		isPublished: { type: Boolean, default: false },
		status: {
			type: String,
			enum: ['draft', 'published'],
			default: 'draft',
		},
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

PageSchema.index({ status: 1, slug: 1 });
PageSchema.index({ isPublished: 1 });

const PageModel = model('Page', PageSchema);
export default PageModel;
