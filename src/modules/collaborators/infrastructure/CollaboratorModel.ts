import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';

const CollaboratorSchema = new Schema(
	{
		id: { type: String, default: generateUUID, index: true },
		name: { type: String, required: true, trim: true, maxlength: 100 },
		role: { type: String, required: true, trim: true, maxlength: 50 },
		level: { type: String, trim: true, maxlength: 50 },
		bio: localizedStringType,
		photoUrl: { type: String },
		userId: { type: String, ref: 'User' },
		socialLinks: {
			linkedin: { type: String },
			twitter: { type: String },
			github: { type: String },
			website: { type: String },
			instagram: { type: String },
		},
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

CollaboratorSchema.index({ status: 1, order: 1 });
CollaboratorSchema.index({ isActive: 1, order: 1 });

const CollaboratorModel = model('Collaborator', CollaboratorSchema);
export default CollaboratorModel;
