import { Router } from 'express';

import { welcomeApi } from '@Modules/welcomeApi';
import { subscribersApi } from '@Modules/subscribers';

const router: Router = Router();

const mainRouter = () => {
	welcomeApi(router);
	subscribersApi(router);

	return router;
};

export default mainRouter;
