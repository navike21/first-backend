import { Router } from 'express';
import { EMAILS_PATH_DISPATCH } from '../constants/paths';
import { verifyDispatchRequest } from '../middlewares/verifyDispatchRequest';
import { emailDispatchController } from '../controllers/email.dispatch';

export function notificationsEmailApi(router: Router) {
	// Worker del outbox: no lleva auth de usuario — lo dispara el schedule de
	// QStash, autenticado por el bearer de verifyDispatchRequest.
	router.post(EMAILS_PATH_DISPATCH, verifyDispatchRequest, emailDispatchController);
}
