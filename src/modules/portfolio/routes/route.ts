import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import { acceptImageFields } from '@Modules/storage';
import {
	PORTFOLIO_PATH_LIST_PUBLIC,
	PORTFOLIO_PATH_LIST_ADMIN,
	PORTFOLIO_PATH_GET_BY_ID,
	PORTFOLIO_PATH_BY_SERVICE,
	PORTFOLIO_PATH_GET_BY_SLUG,
	PORTFOLIO_PATH_CREATE,
	PORTFOLIO_PATH_UPDATE,
	PORTFOLIO_PATH_DELETE,
	PORTFOLIO_PATH_DELETE_PERMANENT,
	PORTFOLIO_PATH_RESTORE,
	PORTFOLIO_PATH_TRASH,
	PORTFOLIO_PATH_BULK_DELETE,
	PORTFOLIO_PATH_BULK_RESTORE,
	PORTFOLIO_PATH_BULK_PURGE,
	PORTFOLIO_GALLERY_MAX_ITEMS,
} from '../constants/paths';

const acceptPortfolioMedia = () =>
	acceptImageFields([{ name: 'cover' }, { name: 'gallery', maxCount: PORTFOLIO_GALLERY_MAX_ITEMS }]);
import { portfolioListPublicController } from '../controllers/portfolio.listPublic';
import { portfolioListByServiceController } from '../controllers/portfolio.listByService';
import { portfolioGetBySlugController } from '../controllers/portfolio.getBySlug';
import { portfolioGetByIdController } from '../controllers/portfolio.getById';
import { portfolioListAdminController } from '../controllers/portfolio.listAdmin';
import { portfolioCreateController } from '../controllers/portfolio.create';
import { portfolioUpdateController } from '../controllers/portfolio.update';
import { portfolioDeleteController } from '../controllers/portfolio.delete';
import { portfolioDeletePermanentController } from '../controllers/portfolio.deletePermanent';
import { portfolioRestoreController } from '../controllers/portfolio.restore';
import { portfolioTrashController } from '../controllers/portfolio.trash';
import { deletePortfolioBulkController } from '../controllers/portfolio.deleteBulk';
import { restorePortfolioBulkController } from '../controllers/portfolio.restoreBulk';
import { purgePortfolioBulkController } from '../controllers/portfolio.purgeBulk';

export function portfolioApi(router: Router) {
	router.get(PORTFOLIO_PATH_LIST_PUBLIC, portfolioListPublicController);

	router.get(
		PORTFOLIO_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_READ, PERMISSIONS.PORTFOLIO_MANAGE),
		portfolioTrashController,
	);
	router.get(
		PORTFOLIO_PATH_LIST_ADMIN,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_READ, PERMISSIONS.PORTFOLIO_MANAGE),
		portfolioListAdminController,
	);
	router.get(
		PORTFOLIO_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_READ, PERMISSIONS.PORTFOLIO_MANAGE),
		portfolioGetByIdController,
	);
	router.get(PORTFOLIO_PATH_BY_SERVICE, portfolioListByServiceController);
	router.get(PORTFOLIO_PATH_GET_BY_SLUG, portfolioGetBySlugController);

	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		PORTFOLIO_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_DELETE, PERMISSIONS.PORTFOLIO_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PORTFOLIO_BULK_SOFT_DELETED,
			resource: 'portfolio',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deletePortfolioBulkController,
	);
	router.patch(
		PORTFOLIO_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_UPDATE, PERMISSIONS.PORTFOLIO_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PORTFOLIO_BULK_RESTORED,
			resource: 'portfolio',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restorePortfolioBulkController,
	);
	router.delete(
		PORTFOLIO_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.PORTFOLIO_BULK_PERMANENTLY_DELETED,
			resource: 'portfolio',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgePortfolioBulkController,
	);

	router.post(
		PORTFOLIO_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_CREATE, PERMISSIONS.PORTFOLIO_MANAGE),
		...acceptPortfolioMedia(),
		captureAudit({ action: AUDIT_ACTIONS.PORTFOLIO_CREATED, resource: 'portfolio' }),
		portfolioCreateController,
	);

	router.patch(
		PORTFOLIO_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_UPDATE, PERMISSIONS.PORTFOLIO_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.PORTFOLIO_RESTORED, resource: 'portfolio' }),
		portfolioRestoreController,
	);

	router.patch(
		PORTFOLIO_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_UPDATE, PERMISSIONS.PORTFOLIO_MANAGE),
		...acceptPortfolioMedia(),
		captureAudit({ action: AUDIT_ACTIONS.PORTFOLIO_UPDATED, resource: 'portfolio' }),
		portfolioUpdateController,
	);

	router.delete(
		PORTFOLIO_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_PURGE),
		captureAudit({ action: AUDIT_ACTIONS.PORTFOLIO_PERMANENTLY_DELETED, resource: 'portfolio' }),
		portfolioDeletePermanentController,
	);
	router.delete(
		PORTFOLIO_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.PORTFOLIO_DELETE, PERMISSIONS.PORTFOLIO_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.PORTFOLIO_SOFT_DELETED, resource: 'portfolio' }),
		portfolioDeleteController,
	);
}
