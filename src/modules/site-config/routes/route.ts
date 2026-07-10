import type { Router } from 'express';
import { PERMISSIONS } from '@Constants/permissions';
import { authenticate, authorize } from '@Modules/auth';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import { siteConfigGetController } from '../controllers/siteConfig.get';
import { siteConfigGetPublicController } from '../controllers/siteConfig.getPublic';
import { siteConfigUpdateController } from '../controllers/siteConfig.update';

export function siteConfigApi(router: Router) {
	// Public: layout contract consumed by the public website project.
	router.get('/site-config/public', siteConfigGetPublicController);

	router.get(
		'/site-config',
		authenticate,
		authorize(PERMISSIONS.SITE_CONFIG_READ, PERMISSIONS.SITE_CONFIG_MANAGE),
		siteConfigGetController,
	);

	router.patch(
		'/site-config',
		authenticate,
		authorize(PERMISSIONS.SITE_CONFIG_UPDATE, PERMISSIONS.SITE_CONFIG_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.SITE_CONFIG_UPDATED, resource: 'site-config' }),
		siteConfigUpdateController,
	);
}
