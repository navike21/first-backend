import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';
import { FORM_FIELD_TYPES } from '../schemas/form.schema';

const FormFieldOptionSchema = new Schema(
	{
		value: { type: String, required: true },
		label: { type: localizedStringType, required: true },
	},
	{ _id: false },
);

const FormFieldSchema = new Schema(
	{
		fieldId: { type: String, required: true, default: generateUUID },
		type: { type: String, enum: FORM_FIELD_TYPES, required: true },
		label: { type: localizedStringType, required: true },
		placeholder: { type: localizedStringType },
		required: { type: Boolean, default: false },
		options: { type: [FormFieldOptionSchema], default: undefined },
		maxLength: { type: Number },
	},
	{ _id: false },
);

const FormSchema = new Schema(
	{
		id: { type: String, default: generateUUID, index: true },
		title: { type: localizedStringType, required: true },
		description: { type: localizedStringType },
		successMessage: { type: localizedStringType },
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
		},
		notificationEmails: { type: [String], default: [] },
		fields: { type: [FormFieldSchema], default: [] },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

FormSchema.index({ status: 1, createdAt: -1 });

const FormModel = model('Form', FormSchema);
export default FormModel;
