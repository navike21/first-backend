import { AppError } from '@Shared/domain/AppError';

export class CollaboratorNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'COLLABORATOR_NOT_FOUND',
			message: 'COLLABORATOR_NOT_FOUND',
		});
	}
}
