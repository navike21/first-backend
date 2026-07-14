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
