import { connectToDatabase } from '@Connection/connectionDB';
import { logError, logInfo } from '@Helpers/log';
import { NextFunction, Request, Response } from 'express';

export const dbConnectedMiddleware = async (
	_: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		await connectToDatabase();
		logInfo('Database connection successful');
		next();
	} catch (error) {
		logError(
			`Database connection error: ${error instanceof Error ? error.message : String(error)}`,
		);
		return res.status(503).json({ error: 'Database connection failed' });
	}
};
