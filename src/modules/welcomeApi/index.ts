import { successResponse } from 'src/libs/helpers/responseStructure';
import { Router } from 'express';

export function welcomeApi(router: Router) {
	router.get('/', (_, res) => {
		successResponse(res, {
			message: 'Welcome to the API',
			data: {
				api: 'First Backend',
				version: '1.0.0',
			},
		});
	});
}
