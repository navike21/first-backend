import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getEcommerceSettings } from '../application/getEcommerceSettings';

// Public contract for a future storefront: currency/tax/checkout policies are
// needed to render prices and totals before any product page exists.
export const ecommerceSettingsGetPublicController = asyncHandler(
	async (_req, res) => {
		const config = await getEcommerceSettings();
		successResponse(res, {
			statusCode: 200,
			message: 'SUCCESS_ECOMMERCE_SETTINGS_FOUND',
			ns: 'ecommerce-settings',
			data: config,
		});
	},
);
