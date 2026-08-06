import type { Router } from 'express';
import { PERMISSIONS } from '@Constants/permissions';
import { authenticate, authorize } from '@Modules/auth';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import { ecommerceSettingsGetController } from '../controllers/ecommerceSettings.get';
import { ecommerceSettingsGetPublicController } from '../controllers/ecommerceSettings.getPublic';
import { ecommerceSettingsUpdateController } from '../controllers/ecommerceSettings.update';

export function ecommerceSettingsApi(router: Router) {
	// Public: currency/tax/checkout policies, consumed by a future storefront.
	router.get('/ecommerce-settings/public', ecommerceSettingsGetPublicController);

	router.get(
		'/ecommerce-settings',
		authenticate,
		authorize(
			PERMISSIONS.ECOMMERCE_SETTINGS_READ,
			PERMISSIONS.ECOMMERCE_SETTINGS_MANAGE,
		),
		ecommerceSettingsGetController,
	);

	router.patch(
		'/ecommerce-settings',
		authenticate,
		authorize(
			PERMISSIONS.ECOMMERCE_SETTINGS_UPDATE,
			PERMISSIONS.ECOMMERCE_SETTINGS_MANAGE,
		),
		captureAudit({
			action: AUDIT_ACTIONS.ECOMMERCE_SETTINGS_UPDATED,
			resource: 'ecommerce-settings',
		}),
		ecommerceSettingsUpdateController,
	);
}
