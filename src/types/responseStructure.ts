export interface ApiError {
	code: string;
	details?: unknown;
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
	statusCode?: number;
	code?: string;
	meta?: MetaInformation;
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
}
