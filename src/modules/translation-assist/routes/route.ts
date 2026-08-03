import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { translationAssistLimiter } from '@Config/limiter';
import { TRANSLATION_ASSIST_PATH_SUGGEST } from '../constants/paths';
import { translationSuggestController } from '../controllers/translation.suggest';

export function translationAssistApi(router: Router) {
	router.post(
		TRANSLATION_ASSIST_PATH_SUGGEST,
		authenticate,
		translationAssistLimiter,
		authorize(PERMISSIONS.SERVICES_UPDATE, PERMISSIONS.SERVICES_MANAGE),
		translationSuggestController,
	);
}
