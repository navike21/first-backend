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
	CreateUserGroupSchema,
	UpdateUserGroupSchema,
	ListUserGroupsQuerySchema,
	ListGroupMembersQuerySchema,
	AddGroupMembersSchema,
} from './schemas/userGroup.schema';

const bearerAuth = [{ bearerAuth: [] }];

const userGroupResponseSchema = registry.register(
	'UserGroup',
	z.object({
		id: z.uuid(),
		name: z.string(),
		description: z.string().optional(),
		permissions: z.array(z.string()),
		color: z.string(),
		status: z.enum(['active', 'inactive']),
		isSystem: z.boolean(),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/permissions/catalog',
	summary: 'List every permission the system recognizes',
	description: 'Source for the group-editor UI’s permission picker.',
	tags: ['User Groups'],
	security: bearerAuth,
	responses: {
		200: successResponse(z.array(z.string())),
		401: commonErrorResponses[401],
	},
});

registry.registerPath({
	method: 'post',
	path: '/user-groups',
	summary: 'Create a group',
	description: 'Requires `user-groups:create` or `:manage`.',
	tags: ['User Groups'],
	security: bearerAuth,
	request: {
		body: {
			content: { 'application/json': { schema: CreateUserGroupSchema } },
		},
	},
	responses: {
		201: successResponse(userGroupResponseSchema, 'Group created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'get',
	path: '/user-groups/trash',
	summary: 'List soft-deleted groups',
	description: 'Requires `user-groups:read` or `:manage`.',
	tags: ['User Groups'],
	security: bearerAuth,
	request: { query: ListUserGroupsQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				items: z.array(userGroupResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/user-groups',
	summary: 'List groups',
	description: 'Requires `user-groups:read` or `:manage`.',
	tags: ['User Groups'],
	security: bearerAuth,
	request: { query: ListUserGroupsQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				items: z.array(userGroupResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/user-groups/bulk',
	summary: 'Soft-delete multiple groups',
	description:
		'Requires `user-groups:delete` or `:manage`. System groups are protected.',
	tags: ['User Groups'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(userGroupResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/user-groups/bulk/restore',
	summary: 'Restore multiple soft-deleted groups',
	description: 'Requires `user-groups:update` or `:manage`.',
	tags: ['User Groups'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(userGroupResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/user-groups/bulk/permanent',
	summary: 'Permanently delete multiple groups (from trash only)',
	description: 'Requires `user-groups:purge` — `:manage` does NOT grant this.',
	tags: ['User Groups'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(userGroupResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/user-groups/{id}/members',
	summary: 'List the users that belong to a group',
	description:
		'Requires BOTH `users:read` and `user-groups:read` (or their `:manage`).',
	tags: ['User Groups'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		query: ListGroupMembersQuerySchema,
	},
	responses: {
		200: successResponse(
			z.object({ items: z.array(z.unknown()), meta: paginationMetaSchema }),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'post',
	path: '/user-groups/{id}/members',
	summary: 'Add users to a group',
	description:
		'Requires BOTH `users:update` and `user-groups:update` (or their `:manage`).',
	tags: ['User Groups'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: {
			content: { 'application/json': { schema: AddGroupMembersSchema } },
		},
	},
	responses: {
		200: successResponse(z.null()),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/user-groups/{id}/members',
	summary: 'Remove multiple users from a group',
	description:
		'Requires BOTH `users:update` and `user-groups:update` (or their `:manage`).',
	tags: ['User Groups'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: {
			content: { 'application/json': { schema: AddGroupMembersSchema } },
		},
	},
	responses: {
		200: successResponse(z.null()),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/user-groups/{id}/members/{userId}',
	summary: 'Remove one user from a group',
	description:
		'Requires BOTH `users:update` and `user-groups:update` (or their `:manage`).',
	tags: ['User Groups'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid(), userId: z.uuid() }) },
	responses: {
		200: successResponse(z.null()),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'get',
	path: '/user-groups/{id}',
	summary: 'Get a group by id',
	description: 'Requires `user-groups:read` or `:manage`.',
	tags: ['User Groups'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(userGroupResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/user-groups/{id}',
	summary: 'Update a group',
	description:
		'Requires `user-groups:update` or `:manage`. System groups are protected from most changes.',
	tags: ['User Groups'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: {
			content: { 'application/json': { schema: UpdateUserGroupSchema } },
		},
	},
	responses: {
		200: successResponse(userGroupResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/user-groups/{id}/restore',
	summary: 'Restore a soft-deleted group',
	description: 'Requires `user-groups:update` or `:manage`.',
	tags: ['User Groups'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(userGroupResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/user-groups/{id}',
	summary: 'Soft-delete a group',
	description:
		'Requires `user-groups:delete` or `:manage`. System groups are protected.',
	tags: ['User Groups'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(userGroupResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/user-groups/{id}/permanent',
	summary: 'Permanently delete a group (from trash only)',
	description: 'Requires `user-groups:purge` — `:manage` does NOT grant this.',
	tags: ['User Groups'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(userGroupResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
