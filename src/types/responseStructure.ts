export interface ApiError {
	code: string;
	details?: unknown;
}

/**
 * Non-blocking warning attached to a successful response. Used when the main
 * operation succeeded but a secondary step (e.g. image upload) failed.
 */
export interface ResponseWarning {
	field: string;
	code: string;
	message: string;
}

/**
 * Result of a create/update use-case that may carry non-blocking warnings
 * (e.g. the record was saved but its image could not be uploaded).
 */
export interface MutationResult<T> {
	data: T;
	warnings: ResponseWarning[];
}

export interface MetaInformation {
	page?: number;
	limit?: number;
	total?: number;
	totalPages?: number;
}

export interface QueryMeta extends MetaInformation {
	timestamp: string;
	requestId?: string;
}

export interface SuccessResponseOptions<T> {
	data: T;
	message?: string;
	ns?: string;
	statusCode?: number;
	code?: string;
	meta?: MetaInformation;
	warnings?: ResponseWarning[];
}

export interface ErrorResponseOptions {
	statusCode: number;
	code: string;
	message: string;
	details?: unknown;
}

export interface ApiResponse<T> {
	success: boolean;
	statusCode: number;
	message: string;
	data?: T;
	code?: string;
	error?: ApiError;
	meta?: QueryMeta;
	warnings?: ResponseWarning[];
}
