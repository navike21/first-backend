import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	PORTFOLIO_PATH_LIST_PUBLIC,
	PORTFOLIO_PATH_LIST_ADMIN,
	PORTFOLIO_PATH_BY_SERVICE,
	PORTFOLIO_PATH_GET_BY_SLUG,
	PORTFOLIO_PATH_CREATE,
	PORTFOLIO_PATH_UPDATE,
	PORTFOLIO_PATH_DELETE,
	PORTFOLIO_PATH_DELETE_PERMANENT,
} from '../constants/paths';
import { portfolioListPublicController } from '../controllers/portfolio.listPublic';
import { portfolioListByServiceController } from '../controllers/portfolio.listByService';
import { portfolioGetBySlugController } from '../controllers/portfolio.getBySlug';
import { portfolioListAdminController } from '../controllers/portfolio.listAdmin';
import { portfolioCreateController } from '../controllers/portfolio.create';
import { portfolioUpdateController } from '../controllers/portfolio.update';
import { portfolioDeleteController } from '../controllers/portfolio.delete';
import { portfolioDeletePermanentController } from '../controllers/portfolio.deletePermanent';

export function portfolioApi(router: Router) {
	router.get(PORTFOLIO_PATH_LIST_PUBLIC, portfolioListPublicController);

	router.get(
		PORTFOLIO_PATH_LIST_ADMIN,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_READ, PERMISSIONS.PORTFOLIO_MANAGE),
		portfolioListAdminController,
	);

	router.get(PORTFOLIO_PATH_BY_SERVICE, portfolioListByServiceController);

	router.get(PORTFOLIO_PATH_GET_BY_SLUG, portfolioGetBySlugController);

	router.post(
		PORTFOLIO_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_CREATE, PERMISSIONS.PORTFOLIO_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PORTFOLIO_CREATED,
			resource: 'portfolio',
		}),
		portfolioCreateController,
	);

	router.patch(
		PORTFOLIO_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_UPDATE, PERMISSIONS.PORTFOLIO_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PORTFOLIO_UPDATED,
			resource: 'portfolio',
		}),
		portfolioUpdateController,
	);

	router.delete(
		PORTFOLIO_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_DELETE, PERMISSIONS.PORTFOLIO_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PORTFOLIO_SOFT_DELETED,
			resource: 'portfolio',
		}),
		portfolioDeleteController,
	);

	router.delete(
		PORTFOLIO_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_PURGE, PERMISSIONS.PORTFOLIO_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PORTFOLIO_PERMANENTLY_DELETED,
			resource: 'portfolio',
		}),
		portfolioDeletePermanentController,
	);
}
