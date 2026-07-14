import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import { successResponse } from '@Config/openapi/responses';

registry.registerPath({
	method: 'get',
	path: '/health',
	summary: 'Health check',
	tags: ['Health'],
	responses: {
		200: successResponse(
			z.object({ status: z.literal('ok'), db: z.string() }),
			'Service is healthy',
		),
		503: {
			description: 'Service is degraded (database not connected)',
			content: {
				'application/json': {
					schema: z.object({
						success: z.literal(false),
						statusCode: z.literal(503),
						message: z.string(),
						code: z.literal('SERVICE_UNAVAILABLE'),
					}),
				},
			},
		},
	},
});
