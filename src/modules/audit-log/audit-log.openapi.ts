import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
	paginationMetaSchema,
} from '@Config/openapi/responses';
import { AuditLogQuerySchema } from './schemas/auditLog.schema';

const bearerAuth = [{ bearerAuth: [] }];

const auditLogResponseSchema = registry.register(
	'AuditLog',
	z.object({
		id: z.uuid(),
		userId: z.uuid().optional(),
		action: z.string(),
		resource: z.string(),
		resourceId: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		ipAddress: z.string().optional(),
		userAgent: z.string().optional(),
		occurredAt: z.iso.datetime(),
		user: z
			.object({ firstName: z.string(), lastName: z.string(), email: z.email() })
			.optional(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/audit-logs',
	summary: 'List audit log entries',
	description: 'Requires `audit-logs:read` or `:manage`.',
	tags: ['Audit Log'],
	security: bearerAuth,
	request: { query: AuditLogQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(auditLogResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/audit-logs/{id}',
	summary: 'Get an audit log entry by id',
	description: 'Requires `audit-logs:read` or `:manage`.',
	tags: ['Audit Log'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(auditLogResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
