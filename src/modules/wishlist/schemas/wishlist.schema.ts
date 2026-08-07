import { z } from 'zod';

export const WishlistProductParamSchema = z.object({
	productId: z.uuid({ message: 'WISHLIST_PRODUCT_ID_INVALID' }),
});
