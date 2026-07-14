import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry';

// Importing each module's *.openapi.ts registers its routes into the shared
// `registry` above (side effect on import) — this file is the only place
// that needs to know about all of them.
import '@Modules/auth/auth.openapi';
import '@Modules/health/health.openapi';
import '@Modules/users/users.openapi';
import '@Modules/user-groups/user-groups.openapi';
import '@Modules/clients/clients.openapi';
import '@Modules/services/services.openapi';
import '@Modules/portfolio/portfolio.openapi';
import '@Modules/pages/pages.openapi';
import '@Modules/collaborators/collaborators.openapi';
import '@Modules/subscribers/subscribers.openapi';
import '@Modules/categories/categories.openapi';
import '@Modules/tags/tags.openapi';
import '@Modules/storage/storage.openapi';
import '@Modules/site-config/site-config.openapi';
import '@Modules/app-settings/app-settings.openapi';
import '@Modules/audit-log/audit-log.openapi';
import '@Modules/config/config.openapi';
import '@Modules/geo/geo.openapi';

export function buildOpenApiDocument() {
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: '3.0.0',
		info: {
			title: 'First Backend API',
			version: '1.0.0',
			description:
				'REST API for First — a multi-purpose CRM + CMS platform. See the repo README for architecture, RBAC, and file-upload conventions.',
		},
		servers: [{ url: '/api/v1' }],
	});
}
