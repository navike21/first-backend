import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	LOCATION_PATH_LIST,
	LOCATION_PATH_CREATE,
	LOCATION_PATH_GET_BY_ID,
	LOCATION_PATH_UPDATE,
	LOCATION_PATH_DELETE,
	LOCATION_PATH_DELETE_PERMANENT,
	LOCATION_PATH_TRASH,
	LOCATION_PATH_RESTORE,
	LOCATION_PATH_BULK_DELETE,
	LOCATION_PATH_BULK_RESTORE,
	LOCATION_PATH_BULK_PURGE,
	STOCK_PATH_ADJUST,
	STOCK_PATH_GET_BY_PRODUCT,
} from '../constants/paths';
import { locationCreateController } from '../controllers/location.create';
import { locationListController } from '../controllers/location.list';
import { locationGetByIdController } from '../controllers/location.getById';
import { locationUpdateController } from '../controllers/location.update';
import { locationDeleteController } from '../controllers/location.delete';
import { locationDeletePermanentController } from '../controllers/location.deletePermanent';
import { locationRestoreController } from '../controllers/location.restore';
import { locationTrashController } from '../controllers/location.trash';
import { deleteLocationsBulkController } from '../controllers/location.deleteBulk';
import { restoreLocationsBulkController } from '../controllers/location.restoreBulk';
import { purgeLocationsBulkController } from '../controllers/location.purgeBulk';
import { stockAdjustController } from '../controllers/stock.adjust';
import { stockGetByProductController } from '../controllers/stock.getByProduct';

export function inventoryApi(router: Router) {
	router.post(
		LOCATION_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_CREATE, PERMISSIONS.INVENTORY_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.LOCATIONS_CREATED,
			resource: 'inventory',
		}),
		locationCreateController,
	);

	router.get(
		LOCATION_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_READ, PERMISSIONS.INVENTORY_MANAGE),
		locationTrashController,
	);
	router.get(
		LOCATION_PATH_LIST,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_READ, PERMISSIONS.INVENTORY_MANAGE),
		locationListController,
	);

	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		LOCATION_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_DELETE, PERMISSIONS.INVENTORY_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.LOCATIONS_BULK_SOFT_DELETED,
			resource: 'inventory',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteLocationsBulkController,
	);
	router.patch(
		LOCATION_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_UPDATE, PERMISSIONS.INVENTORY_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.LOCATIONS_BULK_RESTORED,
			resource: 'inventory',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreLocationsBulkController,
	);
	router.delete(
		LOCATION_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.LOCATIONS_BULK_PERMANENTLY_DELETED,
			resource: 'inventory',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeLocationsBulkController,
	);

	// Stock — distinct `/inventory/stock/*` prefix, so it never collides with
	// `/inventory/locations/:id`; grouped here with the other non-Location
	// routes purely for readability.
	router.patch(
		STOCK_PATH_ADJUST,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_UPDATE, PERMISSIONS.INVENTORY_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.STOCK_ADJUSTED,
			resource: 'inventory',
		}),
		stockAdjustController,
	);
	router.get(
		STOCK_PATH_GET_BY_PRODUCT,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_READ, PERMISSIONS.INVENTORY_MANAGE),
		stockGetByProductController,
	);

	router.get(
		LOCATION_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_READ, PERMISSIONS.INVENTORY_MANAGE),
		locationGetByIdController,
	);

	router.patch(
		LOCATION_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_UPDATE, PERMISSIONS.INVENTORY_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.LOCATIONS_RESTORED,
			resource: 'inventory',
		}),
		locationRestoreController,
	);
	router.patch(
		LOCATION_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_UPDATE, PERMISSIONS.INVENTORY_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.LOCATIONS_UPDATED,
			resource: 'inventory',
		}),
		locationUpdateController,
	);

	router.delete(
		LOCATION_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.LOCATIONS_PERMANENTLY_DELETED,
			resource: 'inventory',
		}),
		locationDeletePermanentController,
	);
	router.delete(
		LOCATION_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.INVENTORY_DELETE, PERMISSIONS.INVENTORY_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.LOCATIONS_SOFT_DELETED,
			resource: 'inventory',
		}),
		locationDeleteController,
	);
}
