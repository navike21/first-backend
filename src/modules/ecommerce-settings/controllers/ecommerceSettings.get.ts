import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getEcommerceSettings } from '../application/getEcommerceSettings';

export const ecommerceSettingsGetController = asyncHandler(
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
