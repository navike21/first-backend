import type { Request, Response, NextFunction } from 'express';

export type ControllerParams = (
	request: Request,
	response: Response,
	next: NextFunction,
) => Promise<void>;
