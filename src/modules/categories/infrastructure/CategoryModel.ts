import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';

const CategorySchema = new Schema(
	{
		id: { type: String, default: generateUUID, index: true },
		name: { type: localizedStringType, required: true },
		slug: { type: String, required: true, trim: true },
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
CategorySchema.index(
	{ slug: 1 },
	{ unique: true, partialFilterExpression: { deletedAt: null } },
);

const CategoryModel = model('Category', CategorySchema);
export default CategoryModel;
