import { MetaInformation } from '@Types/responseStructure';
import type { Request } from 'express';

export const metaInformation = ({
	page = 1,
	limit = 10,
	total = 0,
}: MetaInformation) => ({
	page,
	limit,
	total,
	totalPages: Math.ceil(total / limit),
});

export const paramsInformation = (request: Request) => {
	const { limit, page, status } = request.query;

	const limitNumber = Number(limit);
	const pageNumber = Number(page);

	const skip = (pageNumber - 1) * limitNumber;

	return {
		limitNumber,
		pageNumber,
		statusParam: status as string | undefined,
		skip,
	};
};
