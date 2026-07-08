import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';

const TagSchema = new Schema(
	{
		id: { type: String, default: generateUUID, index: true },
		name: { type: localizedStringType, required: true },
		slug: { type: String, required: true, trim: true },
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
TagSchema.index(
	{ slug: 1 },
	{ unique: true, partialFilterExpression: { deletedAt: null } },
);

const TagModel = model('Tag', TagSchema);
export default TagModel;
