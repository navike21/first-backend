/**
 * @copyright Copyright navike21
 * @license Apache-2.0
 */

import { successResponse } from '@Helpers/responseStructure';
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
