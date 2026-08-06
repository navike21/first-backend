import { AppError } from '@Shared/domain/AppError';

export class LocationNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'LOCATION_NOT_FOUND',
			message: 'LOCATION_NOT_FOUND',
		});
	}
}
