import { z } from 'zod';

export const AddCartItemSchema = z.object({
	productId: z.uuid({ message: 'CART_PRODUCT_ID_INVALID' }),
	variantId: z.uuid({ message: 'CART_VARIANT_ID_INVALID' }).optional(),
	quantity: z.coerce.number().int().min(1).max(999),
});

export const UpdateCartItemQuantitySchema = z.object({
	variantId: z.uuid({ message: 'CART_VARIANT_ID_INVALID' }).optional(),
	quantity: z.coerce.number().int().min(1).max(999),
});

export const RemoveCartItemSchema = z.object({
	variantId: z.uuid({ message: 'CART_VARIANT_ID_INVALID' }).optional(),
});

export type AddCartItemInput = z.infer<typeof AddCartItemSchema>;
export type UpdateCartItemQuantityInput = z.infer<
	typeof UpdateCartItemQuantitySchema
>;
export type RemoveCartItemInput = z.infer<typeof RemoveCartItemSchema>;
