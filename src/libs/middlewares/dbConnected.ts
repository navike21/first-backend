// Middleware para conectar a MongoDB una sola vez

import { connectToDatabase } from '@Connection/dataBase';
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
		console.error('Failed to connect to database:', error);
		return res.status(503).json({ error: 'Database connection failed' });
	}
};
