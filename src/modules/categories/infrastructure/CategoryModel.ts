import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';

const CategorySchema = new Schema(
	{
		id: { type: String, default: generateUUID, index: true },
		name: { type: localizedStringType, required: true },
		slug: { type: localizedStringType },
		parentId: { type: String, default: null },
		order: { type: Number, default: 0 },
		isActive: { type: Boolean, default: true },
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
		},
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

CategorySchema.index({ isActive: 1, order: 1 });
CategorySchema.index({ parentId: 1 });

// Slugs are unique per language, not globally — same per-language partial
// unique index pattern as Services/Pages/Portfolio.
for (const lang of SUPPORTED_LANGUAGES) {
	CategorySchema.index(
		{ [`slug.${lang}`]: 1 },
		{
			unique: true,
			partialFilterExpression: {
				[`slug.${lang}`]: { $type: 'string', $ne: '' },
				deletedAt: null,
			},
		},
	);
}

const CategoryModel = model('Category', CategorySchema);
export default CategoryModel;
