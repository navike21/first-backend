import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import { successResponse } from '@Config/openapi/responses';

const labeledValue = z.object({ value: z.string(), label: z.string() });

registry.registerPath({
	method: 'get',
	path: '/config',
	summary: 'Get reference/lookup data (public)',
	description:
		'Public, read-only taxonomies used to populate select inputs across the app. Query with `?groups=a,b,c` to fetch several groups in one call (unknown groups ignored, unlisted groups omitted from the response); `?lang=xx` resolves labels (defaults to the request language). Groups: `currencies`, `documentTypes`, `languages`, `industries`, `clientTypes`, `genders`, `technologies`, `collaboratorRoles`, `collaboratorLevels`.',
	tags: ['Config'],
	request: {
		query: z.object({
			groups: z.string().optional().openapi({
				description: 'Comma-separated list of group names',
				example: 'currencies,languages',
			}),
			lang: z.string().optional(),
		}),
	},
	responses: {
		200: successResponse(
			z.object({
				currencies: z
					.array(labeledValue.extend({ symbol: z.string() }))
					.optional(),
				documentTypes: z
					.array(
						labeledValue.extend({
							pattern: z.string().optional(),
							maxLength: z.number().optional(),
						}),
					)
					.optional(),
				languages: z.array(labeledValue).optional(),
				industries: z.array(labeledValue).optional(),
				clientTypes: z.array(labeledValue).optional(),
				genders: z.array(labeledValue).optional(),
				technologies: z.array(labeledValue).optional(),
				collaboratorRoles: z.array(labeledValue).optional(),
				collaboratorLevels: z.array(labeledValue).optional(),
			}),
		),
	},
});
