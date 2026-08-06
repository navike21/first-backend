import { successResponse } from '@Helpers/responseStructure';
import type { Response } from 'express';
import type { MetaInformation, ResponseWarning } from '@Types/responseStructure';

interface RespondBlogOptions {
	warnings?: ResponseWarning[];
	meta?: MetaInformation;
}

/** Every blog response shares the same `code === message` + `ns: 'blog'`
 * shape — this just removes that literal repetition across controllers. */
export function respondBlog(
	res: Response,
	statusCode: number,
	code: string,
	data: unknown,
	options: RespondBlogOptions = {},
): void {
	successResponse(res, {
		statusCode,
		code,
		message: code,
		ns: 'blog',
		data,
		...options,
	});
}
