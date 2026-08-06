import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updateEcommerceSettings } from '../application/updateEcommerceSettings';
import { EcommerceSettingsUpdateSchema } from '../schemas/ecommerceSettings.schema';

export const ecommerceSettingsUpdateController = asyncHandler(
	async (req, res) => {
		const validated = validate(EcommerceSettingsUpdateSchema, req.body);

		const data = await updateEcommerceSettings(validated);
		successResponse(res, {
			statusCode: 200,
			message: 'SUCCESS_ECOMMERCE_SETTINGS_UPDATED',
			ns: 'ecommerce-settings',
			data,
		});
	},
);
