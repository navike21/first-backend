/**
 * @copyright Copyright navike21
 * @license Apache-2.0
 */

import { welcomeApi } from '@Modules/welcomeApi';
import { Router } from 'express';

const router: Router = Router();

const mainRouter = (): Router => {
	welcomeApi(router);

	return router;
};

export default mainRouter;
