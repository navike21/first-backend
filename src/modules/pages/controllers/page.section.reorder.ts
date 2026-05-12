import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { reorderSections } from '../application/reorderSections';
import { ReorderSectionsSchema } from '../schemas/page.schema';

export const pageSectionReorderController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const parsed = ReorderSectionsSchema.safeParse(req.body);
	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed',
			details: {
				validation: parsed.error.issues.map((i) => ({
					path: i.path.join('.'),
					message: i.message,
				})),
			},
		});
	}

	const data = await reorderSections(slug, parsed.data!.order);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_SECTIONS_REORDERED',
		message: 'SUCCESS_PAGE_SECTIONS_REORDERED',
		ns: 'pages',
		data,
	});
});
