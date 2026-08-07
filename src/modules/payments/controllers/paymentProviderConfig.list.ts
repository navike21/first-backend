import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listPaymentProviderConfigs } from '../application/listPaymentProviderConfigs';

export const paymentProviderConfigListController = asyncHandler(async (req, res) => {
	const data = await listPaymentProviderConfigs();
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAYMENT_PROVIDER_CONFIG_LIST',
		message: 'SUCCESS_PAYMENT_PROVIDER_CONFIG_LIST',
		ns: 'payments',
		data,
	});
});
