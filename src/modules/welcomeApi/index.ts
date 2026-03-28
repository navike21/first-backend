import { successResponse } from '@Helpers/responseStructure';
import type { Router } from 'express';

export function welcomeApi(router: Router) {
	router.get('/', (_, res) => {
		successResponse(res, {
			message: 'Welcome to the First Backend API',
			data: {
				api: 'First Backend',
				version: '1.0.0',
			},
		});
	});
}
