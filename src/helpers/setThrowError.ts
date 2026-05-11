import { AppError } from '@Shared/domain/AppError';
import { ErrorResponseOptions } from '@Types/responseStructure';

export default function setThrowError(errorData: ErrorResponseOptions): never {
	throw new AppError(errorData);
}
