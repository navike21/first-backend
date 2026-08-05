import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { translationAssistLimiter } from '@Config/limiter';
import { TRANSLATION_ASSIST_PATH_SUGGEST } from '../constants/paths';
import { translationSuggestController } from '../controllers/translation.suggest';
import { authorizeTranslationDomain } from '../middlewares/authorizeTranslationDomain';

export function translationAssistApi(router: Router) {
	router.post(
		TRANSLATION_ASSIST_PATH_SUGGEST,
		authenticate,
		translationAssistLimiter,
		authorizeTranslationDomain,
		translationSuggestController,
	);
}
