import { ErrorResponseOptions } from '@Types/responseStructure';

export default function setThrowError(errorData: ErrorResponseOptions): never {
	throw new Error(JSON.stringify(errorData));
}
