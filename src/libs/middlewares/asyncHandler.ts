import { ControllerParams } from '@Types/controllerParams';
import type { Request, Response, NextFunction } from 'express';

export const asyncHandler =
	(fn: ControllerParams) =>
	(req: Request, res: Response, next: NextFunction): void => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
