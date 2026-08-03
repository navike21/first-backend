import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { suggestTranslation } from '../application/suggestTranslation';
import { SuggestTranslationSchema } from '../schemas/suggestTranslation.schema';

export const translationSuggestController = asyncHandler(async (req, res) => {
	const validated = validate(SuggestTranslationSchema, req.body);
	const result = await suggestTranslation(validated);
	successResponse(res, {
		statusCode: 200,
		code: 'TRANSLATION_SUGGESTION_OK',
		message: 'Translation suggested',
		data: result,
	});
});
