import { successResponse, errorResponse } from '@Helpers/responseStructure';
import type { Router } from 'express';
import mongoose from 'mongoose';

export function healthApi(router: Router) {
	router.get('/health', (_, res) => {
		const readyState = mongoose.connection.readyState;
		const dbConnected = readyState === 1;
		const dbStatus =
			readyState === 1 ? 'connected' :
			readyState === 2 ? 'connecting' :
			'disconnected';

		if (!dbConnected) {
			return errorResponse(res, {
				statusCode: 503,
				code: 'SERVICE_UNAVAILABLE',
				message: 'Service is degraded',
				details: { db: dbStatus },
			});
		}

		return successResponse(res, {
			statusCode: 200,
			code: 'HEALTH_OK',
			message: 'Service is healthy',
			data: { status: 'ok', db: dbStatus },
		});
	});
}
