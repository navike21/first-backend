export interface ApiResponse<T> {
	success: boolean;
	statusCode: number;
	message: string;
	data?: T;
	code?: string;
	error?: ApiError;
	meta?: Meta;
}

export interface ApiError {
	code: string;
	details?: unknown;
}

export interface Meta {
	timestamp: string;
	requestId?: string;
}

export interface SuccessResponseOptions<T> {
	data: T;
	message?: string;
	statusCode?: number;
	code?: string;
}

export interface ErrorResponseOptions {
	statusCode: number;
	code: string;
	message: string;
	details?: unknown;
}
