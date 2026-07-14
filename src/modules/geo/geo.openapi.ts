import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import { successResponse } from '@Config/openapi/responses';

const countryResponseSchema = z.object({
	code: z.string(),
	code3: z.string(),
	name: z.string(),
	flag: z.string(),
	dialCode: z.string(),
	hasDivisions: z.boolean(),
	divisionLevels: z.array(z.string()).optional(),
});

const divisionsResponseSchema = z.object({
	levels: z.array(z.string()),
	items: z.array(
		z.object({ code: z.string(), name: z.string(), hasChildren: z.boolean() }),
	),
});

registry.registerPath({
	method: 'get',
	path: '/geo/countries',
	summary: 'List countries (public)',
	description:
		'Public, no auth. `?lang=xx` resolves country names (defaults to the request language, via `Intl.DisplayNames` with a stored-name fallback).',
	tags: ['Geo'],
	request: { query: z.object({ lang: z.string().optional() }) },
	responses: { 200: successResponse(z.array(countryResponseSchema)) },
});

registry.registerPath({
	method: 'get',
	path: '/geo/{country}/divisions',
	summary: 'List top-level administrative divisions for a country (public)',
	description:
		'Public, no auth. Only Peru (`PE`) has full division data today; other countries return an empty list.',
	tags: ['Geo'],
	request: { params: z.object({ country: z.string() }) },
	responses: { 200: successResponse(divisionsResponseSchema) },
});

registry.registerPath({
	method: 'get',
	path: '/geo/{country}/divisions/{parentCode}',
	summary:
		'List child administrative divisions under a parent division (public)',
	description:
		'Public, no auth. Used to cascade e.g. department → province → district.',
	tags: ['Geo'],
	request: {
		params: z.object({ country: z.string(), parentCode: z.string() }),
	},
	responses: { 200: successResponse(divisionsResponseSchema) },
});
