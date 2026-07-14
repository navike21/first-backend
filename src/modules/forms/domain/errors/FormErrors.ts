import { AppError } from '@Shared/domain/AppError';

export class FormNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'FORM_NOT_FOUND',
			message: 'FORM_NOT_FOUND',
		});
	}
}

// Reused (not a separate class) by the public GET/submit endpoints when a
// form is missing, soft-deleted, or `status !== 'active'` — always the same
// plain 404, never leaking that an inactive form exists.
export const FormInactiveError = FormNotFoundError;

export class FormSubmissionNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'FORM_SUBMISSION_NOT_FOUND',
			message: 'FORM_SUBMISSION_NOT_FOUND',
		});
	}
}
