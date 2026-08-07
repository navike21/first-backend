import { Router } from 'express';
import { authenticateCustomer } from '@Modules/customer-auth';
import {
	WISHLIST_PATH_GET,
	WISHLIST_PATH_ADD_ITEM,
	WISHLIST_PATH_REMOVE_ITEM,
} from '../constants/paths';
import { wishlistGetController } from '../controllers/wishlist.get';
import { wishlistAddItemController } from '../controllers/wishlist.addItem';
import { wishlistRemoveItemController } from '../controllers/wishlist.removeItem';

// Same realm/self-only precedent as cart: gated by `authenticateCustomer`,
// never staff RBAC.
export function wishlistApi(router: Router) {
	router.get(WISHLIST_PATH_GET, authenticateCustomer, wishlistGetController);
	router.post(
		WISHLIST_PATH_ADD_ITEM,
		authenticateCustomer,
		wishlistAddItemController,
	);
	router.delete(
		WISHLIST_PATH_REMOVE_ITEM,
		authenticateCustomer,
		wishlistRemoveItemController,
	);
}
