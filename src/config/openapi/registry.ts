import { z } from 'zod';
import {
	extendZodWithOpenApi,
	OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';

// Adds the `.openapi()` method to Zod schemas. Must run once, before any
// schema is registered — importing this module has that side effect.
extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'bearerAuth', {
	type: 'http',
	scheme: 'bearer',
	bearerFormat: 'JWT',
	description:
		'Access token from POST /auth/login. Send as `Authorization: Bearer <token>`.',
});

// Separate realm from staff `bearerAuth` — a customer access token from
// POST /customer-auth/login is never interchangeable with a staff one.
registry.registerComponent('securitySchemes', 'customerBearerAuth', {
	type: 'http',
	scheme: 'bearer',
	bearerFormat: 'JWT',
	description:
		'Access token from POST /customer-auth/login. Send as `Authorization: Bearer <token>`.',
});
