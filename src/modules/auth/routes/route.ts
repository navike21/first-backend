import { Router } from 'express';

import { AUTH_LOGIN } from '../constants/paths';
import { authLogin } from '../controllers/auth.login';

export function authApi(router: Router) {
	router.post(AUTH_LOGIN, authLogin);
}
