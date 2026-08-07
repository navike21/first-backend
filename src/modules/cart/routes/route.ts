import { Router } from 'express';
import { authenticateCustomer } from '@Modules/customer-auth';
import {
	CART_PATH_GET,
	CART_PATH_ADD_ITEM,
	CART_PATH_UPDATE_ITEM,
	CART_PATH_REMOVE_ITEM,
	CART_PATH_CLEAR,
} from '../constants/paths';
import { cartGetController } from '../controllers/cart.get';
import { cartAddItemController } from '../controllers/cart.addItem';
import { cartUpdateItemController } from '../controllers/cart.updateItem';
import { cartRemoveItemController } from '../controllers/cart.removeItem';
import { cartClearController } from '../controllers/cart.clear';

// Gated by `authenticateCustomer` (customer JWT realm), never staff
// `authenticate`/`authorize` — a cart is always the caller's own, there is
// no "manage another customer's cart" concept for this module.
export function cartApi(router: Router) {
	router.get(CART_PATH_GET, authenticateCustomer, cartGetController);
	router.post(CART_PATH_ADD_ITEM, authenticateCustomer, cartAddItemController);
	router.patch(
		CART_PATH_UPDATE_ITEM,
		authenticateCustomer,
		cartUpdateItemController,
	);
	router.delete(
		CART_PATH_REMOVE_ITEM,
		authenticateCustomer,
		cartRemoveItemController,
	);
	router.delete(CART_PATH_CLEAR, authenticateCustomer, cartClearController);
}
