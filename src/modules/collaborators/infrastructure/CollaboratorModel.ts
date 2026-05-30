import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';

const CollaboratorSchema = new Schema(
	{
		id: { type: String, default: generateUUID, index: true },
		name: { type: String, required: true, trim: true, maxlength: 100 },
		role: localizedStringType,
		bio: localizedStringType,
		photoUrl: { type: String },
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
			enum: ['active', 'inactive', 'deleted'],
			default: 'active',
		},
		deletedAt: { type: Date },
	},
	{ timestamps: true },
);

CollaboratorSchema.index({ status: 1, order: 1 });
CollaboratorSchema.index({ isActive: 1, order: 1 });

const CollaboratorModel = model('Collaborator', CollaboratorSchema);
export default CollaboratorModel;
