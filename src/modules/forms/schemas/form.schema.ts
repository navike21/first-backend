import { z } from 'zod';
import { LocalizedStringSchema } from '@Shared/schemas/localizedString.schema';

export const FORM_FIELD_TYPES = [
	'text',
	'textarea',
	'email',
	'phone',
	'select',
	'radio',
	'checkbox',
	'date',
] as const;

export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];

const FormFieldOptionSchema = z.object({
	value: z.string().trim().min(1).max(100),
	label: LocalizedStringSchema,
});

const FormFieldSchema = z
	.object({
		fieldId: z.uuid({ message: 'FORM_FIELD_ID_INVALID' }).optional(),
		type: z.enum(FORM_FIELD_TYPES, { message: 'FORM_FIELD_TYPE_INVALID' }),
		label: LocalizedStringSchema,
		placeholder: LocalizedStringSchema.optional(),
		required: z.boolean().default(false),
		options: z.array(FormFieldOptionSchema).max(50).optional(),
		maxLength: z.coerce.number().int().min(1).max(5000).optional(),
	})
	.refine(
		(field) =>
			(field.type !== 'select' && field.type !== 'radio') ||
			(field.options?.length ?? 0) >= 2,
		{ message: 'FORM_FIELD_OPTIONS_REQUIRED', path: ['options'] },
	);

export type FormFieldConfig = z.infer<typeof FormFieldSchema>;

export const CreateFormSchema = z.object({
	title: LocalizedStringSchema,
	description: LocalizedStringSchema.optional(),
	successMessage: LocalizedStringSchema.optional(),
	status: z.enum(['active', 'inactive']).default('active'),
	notificationEmails: z
		.array(z.email({ message: 'FORM_NOTIFICATION_EMAIL_INVALID' }))
		.max(10)
		.default([]),
	fields: z.array(FormFieldSchema).min(1).max(30),
});

export const UpdateFormSchema = CreateFormSchema.partial();

export const ListFormsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	search: z.string().trim().max(200).optional(),
	status: z.enum(['active', 'inactive']).optional(),
});

export const ListFormSubmissionsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	isRead: z.coerce.boolean().optional(),
});

export type CreateFormInput = z.infer<typeof CreateFormSchema>;
export type UpdateFormInput = z.infer<typeof UpdateFormSchema>;
