import { model, Schema } from 'mongoose';
import {
	ACTIVE,
	STATUS_REGISTER_ARRAY,
	StatusRegister,
} from '@Constants/statusRegister';
import generateUUID from '@Helpers/uuid';

export interface StorageVariant {
	pathname: string;
	url: string;
}

export interface StorageFileDocument {
	id: string;
	entityType: string;
	entityId: string;
	originalName: string;
	mimeType: string;
	size: number;
	isImage: boolean;
	original: StorageVariant;
	full?: StorageVariant;
	thumb?: StorageVariant;
	uploadedBy?: string;
	status: StatusRegister;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const variantSchema = new Schema<StorageVariant>(
	{
		pathname: { type: String, required: true },
		url: { type: String, required: true },
	},
	{ _id: false },
);

const storageFileSchema = new Schema<StorageFileDocument>(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		entityType: { type: String, required: true, maxlength: 50 },
		entityId: { type: String, required: true },
		originalName: { type: String, required: true, maxlength: 255 },
		mimeType: { type: String, required: true },
		size: { type: Number, required: true },
		isImage: { type: Boolean, required: true, default: false },
		original: { type: variantSchema, required: true },
		full: { type: variantSchema },
		thumb: { type: variantSchema },
		uploadedBy: { type: String },
		status: {
			type: String,
			required: true,
			enum: STATUS_REGISTER_ARRAY,
			default: ACTIVE,
		},
		deletedAt: { type: Date },
	},
	{ timestamps: true },
);

storageFileSchema.index({ entityType: 1, entityId: 1 });
storageFileSchema.index({ uploadedBy: 1 });
storageFileSchema.index({ status: 1, createdAt: -1 });

export default model<StorageFileDocument>('StorageFile', storageFileSchema);
