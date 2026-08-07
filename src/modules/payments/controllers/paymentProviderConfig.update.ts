import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { isKnownPaymentProvider } from '../constants/providerRegistry';
import { updatePaymentProviderConfigSchemaFor } from '../schemas/paymentProviderConfig.schema';
import { upsertPaymentProviderConfig } from '../application/upsertPaymentProviderConfig';
import { PaymentProviderUnknownError } from '../domain/errors/PaymentErrors';

export const paymentProviderConfigUpdateController = asyncHandler(async (req, res) => {
	const provider = String(req.params.provider);
	if (!isKnownPaymentProvider(provider)) throw new PaymentProviderUnknownError();

	const validated = validate(updatePaymentProviderConfigSchemaFor(provider), req.body);

	const data = await upsertPaymentProviderConfig(provider, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAYMENT_PROVIDER_CONFIG_UPDATE',
		message: 'SUCCESS_PAYMENT_PROVIDER_CONFIG_UPDATE',
		ns: 'payments',
		data,
	});
});
