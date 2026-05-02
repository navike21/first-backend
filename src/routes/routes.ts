import { Router } from 'express';

import { welcomeApi } from '@Modules/welcomeApi';
import { subscribersApi } from '@Modules/subscribers';
import { healthApi } from '@Modules/health';
import { authApi } from '@Modules/auth';
import { usersApi } from '@Modules/users';
import { userGroupsApi } from '@Modules/user-groups';

const router: Router = Router();

const mainRouter = () => {
	welcomeApi(router);

	const v1Router = Router();
	healthApi(v1Router);
	authApi(v1Router);
	usersApi(v1Router);
	userGroupsApi(v1Router);
	subscribersApi(v1Router);

	router.use('/api/v1', v1Router);

	return router;
};

export default mainRouter;
