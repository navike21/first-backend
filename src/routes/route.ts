import { Router } from 'express';

import { authApi } from '@Modules/auth/routes/route';
import { welcomeApi } from '@Modules/welcomeApi';
import { usersApi } from '@Modules/users';
import { clientsApi } from '@Modules/clients';

const router: Router = Router();

const mainRouter = (): Router => {
	welcomeApi(router);
	authApi(router);
	usersApi(router);
	clientsApi(router);

	return router;
};

export default mainRouter;
