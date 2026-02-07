import { Request } from 'express';

interface MetaInformationProps {
	page: number;
	limit: number;
	total: number;
}

export const metaInformation = ({
	page,
	limit,
	total,
}: MetaInformationProps) => ({
	page,
	limit,
	total,
	totalPages: Math.ceil(total / limit),
});

export const paramsInformation = (request: Request) => {
	const { limit = 10, page = 1, status } = request.query;

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
