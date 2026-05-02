import { successResponse, errorResponse } from '@Helpers/responseStructure';
import type { Router } from 'express';
import mongoose from 'mongoose';

export function healthApi(router: Router) {
	router.get('/health', (_, res) => {
		const readyState = mongoose.connection.readyState;
		const dbConnected = readyState === 1;

		const getDbStatus = (state: number) => {
			if (state === 1) return 'connected';
			if (state === 2) return 'connecting';
			return 'disconnected';
		};

		const dbStatus = getDbStatus(readyState);

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
