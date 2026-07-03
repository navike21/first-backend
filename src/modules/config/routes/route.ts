import { Router } from 'express';
import { CONFIG_PATH } from '../constants/paths';
import { configController } from '../controllers/config.controller';

// Public reference/lookup data (currencies, document types, languages,
// industries). Query with `?groups=a,b,c` to fetch several groups in one call.
export function configApi(router: Router) {
	router.get(CONFIG_PATH, configController);
}
