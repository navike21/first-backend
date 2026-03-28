import { connectToDatabase } from '@Connection/connectionDB';
import { logError } from '@Helpers/log';
import { NextFunction, Request, Response } from 'express';

export const dbConnectedMiddleware = (
	error: unknown,
	_: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		connectToDatabase();
		next();
	} catch (error) {
		logError(
			`Database connection error: ${error instanceof Error ? error.message : String(error)}`,
		);
		return res.status(503).json({ error: 'Database connection failed' });
	}
};
