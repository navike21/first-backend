import { Router } from 'express';

import { welcomeApi } from '@Modules/welcomeApi';

const router: Router = Router();

const mainRouter = () => {
	welcomeApi(router);

	return router;
};

export default mainRouter;
