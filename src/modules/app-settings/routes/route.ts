import type { Router } from 'express';
import { PERMISSIONS } from '@Constants/permissions';
import { authenticate, authorize } from '@Modules/auth';
import { appSettingsGetController } from '../controllers/appSettings.get';
import { appSettingsUpdateController } from '../controllers/appSettings.update';

export function appSettingsApi(router: Router) {
	router.get('/app-settings', authenticate, appSettingsGetController);

	router.patch(
		'/app-settings',
		authenticate,
		authorize(PERMISSIONS.APP_SETTINGS_UPDATE, PERMISSIONS.APP_SETTINGS_MANAGE),
		appSettingsUpdateController,
	);
}
