import { z } from 'zod';

export const AdjustStockSchema = z.object({
	productId: z.uuid({ message: 'STOCK_PRODUCT_ID_INVALID' }),
	variantId: z.uuid({ message: 'STOCK_VARIANT_ID_INVALID' }).optional(),
	locationId: z.uuid({ message: 'STOCK_LOCATION_ID_INVALID' }),
	quantity: z
		.number({ error: 'STOCK_QUANTITY_INVALID' })
		.int({ error: 'STOCK_QUANTITY_INVALID' })
		.min(0, { message: 'STOCK_QUANTITY_INVALID' }),
});

export type AdjustStockInput = z.infer<typeof AdjustStockSchema>;
