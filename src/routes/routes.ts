import { Router } from 'express';

import { welcomeApi } from '@Modules/welcomeApi';
import { subscribersApi } from '@Modules/subscribers';
import { healthApi } from '@Modules/health';

const router: Router = Router();

const mainRouter = () => {
	welcomeApi(router);

	const v1Router = Router();
	healthApi(v1Router);
	subscribersApi(v1Router);

	router.use('/api/v1', v1Router);

	return router;
};

export default mainRouter;
