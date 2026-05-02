import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { ALL_PERMISSIONS, PERMISSIONS } from '@Constants/permissions';

export const listPermissionCatalogController = asyncHandler(
	async (_req, res) => {
		const catalog = Object.entries(PERMISSIONS).map(([key, value]) => {
			const [resource, action] = value.split(':');
			return { key, value, resource, action };
		});

		successResponse(res, {
			statusCode: 200,
			code: 'PERMISSIONS_CATALOG',
			message: 'PERMISSIONS_CATALOG',
			ns: 'user-groups',
			data: { permissions: ALL_PERMISSIONS, catalog },
		});
	},
);
