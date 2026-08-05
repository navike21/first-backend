import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';

const TagSchema = new Schema(
	{
		id: { type: String, default: generateUUID, index: true },
		name: { type: localizedStringType, required: true },
		slug: { type: localizedStringType },
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

TagSchema.index({ isActive: 1, order: 1 });

// Slugs are unique per language, not globally — same per-language partial
// unique index pattern as Services/Pages/Portfolio/Categories.
for (const lang of SUPPORTED_LANGUAGES) {
	TagSchema.index(
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

const TagModel = model('Tag', TagSchema);
export default TagModel;
