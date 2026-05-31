import { model, Schema } from 'mongoose';
import { ALL_PERMISSIONS, Permission } from '@Constants/permissions';
import generateUUID from '@Helpers/uuid';

export interface UserGroupDocument {
	id: string;
	name: string;
	slug: string;
	description?: string;
	permissions: Permission[];
	color: string;
	isSystem: boolean;
	status: 'active' | 'inactive';
	deletedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

const userGroupSchema = new Schema<UserGroupDocument>(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		name: {
			type: String,
			required: true,
			minlength: 2,
			maxlength: 80,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		description: { type: String, maxlength: 255, trim: true },
		permissions: {
			type: [String],
			required: true,
			validate: {
				validator: (v: string[]) =>
					v.every(
						(p) => (ALL_PERMISSIONS as string[]).includes(p) || p === '*:*',
					),
				message: 'One or more permissions are invalid',
			},
			default: [],
		},
		color: {
			type: String,
			required: true,
			default: '#6366f1',
			match: /^#[0-9A-Fa-f]{6}$/,
		},
		isSystem: { type: Boolean, required: true, default: false },
		status: {
			type: String,
			required: true,
			enum: ['active', 'inactive'],
			default: 'active',
		},
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

export default model<UserGroupDocument>('UserGroup', userGroupSchema);
