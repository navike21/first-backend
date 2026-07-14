import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
	bulkIdsRequestSchema,
	bulkResultSchema,
	paginationMetaSchema,
} from '@Config/openapi/responses';
import {
	CreateFormSchema,
	UpdateFormSchema,
	ListFormsQuerySchema,
	ListFormSubmissionsQuerySchema,
	FORM_FIELD_TYPES,
} from './schemas/form.schema';

const bearerAuth = [{ bearerAuth: [] }];
const localizedString = z.record(z.string(), z.string());

const formFieldOptionResponseSchema = z.object({
	value: z.string(),
	label: localizedString,
});

const formFieldResponseSchema = z.object({
	fieldId: z.uuid(),
	type: z.enum(FORM_FIELD_TYPES),
	label: localizedString,
	placeholder: localizedString.optional(),
	required: z.boolean(),
	options: z.array(formFieldOptionResponseSchema).optional(),
	maxLength: z.number().optional(),
});

const formResponseSchema = registry.register(
	'Form',
	z.object({
		id: z.uuid(),
		title: localizedString,
		description: localizedString.optional(),
		successMessage: localizedString.optional(),
		status: z.enum(['active', 'inactive']),
		notificationEmails: z.array(z.email()),
		fields: z.array(formFieldResponseSchema),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

const publicFormResponseSchema = registry.register(
	'PublicForm',
	z.object({
		id: z.uuid(),
		title: localizedString,
		description: localizedString.optional(),
		successMessage: localizedString.optional(),
		status: z.literal('active'),
		fields: z.array(formFieldResponseSchema),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

const formSubmissionResponseSchema = registry.register(
	'FormSubmission',
	z.object({
		id: z.uuid(),
		formId: z.uuid(),
		data: z.record(z.string(), z.unknown()),
		isRead: z.boolean(),
		ipAddress: z.string().optional(),
		userAgent: z.string().optional(),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/forms/public/{id}',
	summary: 'Get a form definition for public rendering',
	description:
		'Public, no auth. 404s (not distinguishable from a real 404) when the form is missing, soft-deleted, or inactive. Excludes `notificationEmails`.',
	tags: ['Forms'],
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(publicFormResponseSchema),
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/forms/{id}/submissions',
	summary: 'Submit a response to a form (public)',
	description:
		"Public, no auth, rate-limited (10/min per IP). Request body shape is dynamic — validated at request time against the target form's own field list (see `buildSubmissionSchema`), keyed by each field's `fieldId`.",
	tags: ['Forms'],
	request: {
		params: z.object({ id: z.uuid() }),
		body: {
			content: {
				'application/json': {
					schema: z.record(z.string(), z.unknown()).openapi({
						description: 'Keyed by fieldId — shape depends on the target form',
					}),
				},
			},
		},
	},
	responses: {
		201: successResponse(formSubmissionResponseSchema, 'Submission received'),
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
		429: commonErrorResponses[429],
	},
});

registry.registerPath({
	method: 'get',
	path: '/forms/trash',
	summary: 'List soft-deleted forms',
	description: 'Requires `forms:read` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(formResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/forms/bulk',
	summary: 'Soft-delete multiple forms',
	description: 'Requires `forms:delete` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(formResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/forms/bulk/restore',
	summary: 'Restore multiple soft-deleted forms',
	description: 'Requires `forms:update` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(formResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/forms/bulk/permanent',
	summary: 'Permanently delete multiple forms (from trash only)',
	description:
		'Requires `forms:purge` — `:manage` does NOT grant this. Cascades: also deletes every submission for each purged form.',
	tags: ['Forms'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(formResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/forms/{id}/submissions/trash',
	summary: 'List soft-deleted submissions for a form',
	description: 'Requires `forms-submissions:read` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(formSubmissionResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/forms/{id}/submissions/bulk',
	summary: 'Soft-delete multiple submissions',
	description: 'Requires `forms-submissions:delete` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(formSubmissionResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/forms/{id}/submissions/bulk/restore',
	summary: 'Restore multiple soft-deleted submissions',
	description: 'Requires `forms-submissions:delete` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(formSubmissionResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/forms/{id}/submissions/bulk/permanent',
	summary: 'Permanently delete multiple submissions (from trash only)',
	description:
		'Requires `forms-submissions:purge` — `:manage` does NOT grant this.',
	tags: ['Forms'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(formSubmissionResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/forms/{id}/submissions',
	summary: 'List submissions for a form',
	description: 'Requires `forms-submissions:read` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		query: ListFormSubmissionsQuerySchema,
	},
	responses: {
		200: successResponse(
			z.object({
				data: z.array(formSubmissionResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/forms/{id}/submissions/{submissionId}',
	summary: 'Get a submission by id',
	description: 'Requires `forms-submissions:read` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid(), submissionId: z.uuid() }) },
	responses: {
		200: successResponse(formSubmissionResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/forms/{id}/submissions/{submissionId}/read',
	summary: 'Mark a submission as read',
	description: 'Requires `forms-submissions:read` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid(), submissionId: z.uuid() }) },
	responses: {
		200: successResponse(formSubmissionResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/forms/{id}/submissions/{submissionId}/restore',
	summary: 'Restore a soft-deleted submission',
	description: 'Requires `forms-submissions:delete` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid(), submissionId: z.uuid() }) },
	responses: {
		200: successResponse(formSubmissionResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/forms/{id}/submissions/{submissionId}/permanent',
	summary: 'Permanently delete a submission (from trash only)',
	description:
		'Requires `forms-submissions:purge` — `:manage` does NOT grant this.',
	tags: ['Forms'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid(), submissionId: z.uuid() }) },
	responses: {
		200: successResponse(formSubmissionResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/forms/{id}/submissions/{submissionId}',
	summary: 'Soft-delete a submission',
	description: 'Requires `forms-submissions:delete` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid(), submissionId: z.uuid() }) },
	responses: {
		200: successResponse(formSubmissionResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'get',
	path: '/forms',
	summary: 'List forms',
	description: 'Requires `forms:read` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: { query: ListFormsQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(formResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'post',
	path: '/forms',
	summary: 'Create a form',
	description: 'Requires `forms:create` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: CreateFormSchema } } },
	},
	responses: {
		201: successResponse(formResponseSchema, 'Form created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'get',
	path: '/forms/{id}',
	summary: 'Get a form by id (admin)',
	description: 'Requires `forms:read` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(formResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/forms/{id}/restore',
	summary: 'Restore a soft-deleted form',
	description: 'Requires `forms:update` or `:manage`.',
	tags: ['Forms'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(formResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/forms/{id}',
	summary: 'Update a form',
	description:
		'Requires `forms:update` or `:manage`. Replaces the whole `fields` array when provided — array index is the field order (no separate reorder endpoint).',
	tags: ['Forms'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: { content: { 'application/json': { schema: UpdateFormSchema } } },
	},
	responses: {
		200: successResponse(formResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/forms/{id}/permanent',
	summary: 'Permanently delete a form (from trash only)',
	description:
		'Requires `forms:purge` — `:manage` does NOT grant this. Cascades: also deletes every submission for this form.',
	tags: ['Forms'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(formResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/forms/{id}',
	summary: 'Soft-delete a form',
	description:
		'Requires `forms:delete` or `:manage`. Does NOT cascade — submissions remain triageable in trash.',
	tags: ['Forms'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(formResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
