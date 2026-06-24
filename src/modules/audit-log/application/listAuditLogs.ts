import AuditLogModel from '../infrastructure/AuditLogModel';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';

export interface AuditLogFilters {
	userId?: string;
	action?: string;
	resource?: string;
	dateFrom?: string;
	dateTo?: string;
	page?: number;
	limit?: number;
}

export async function listAuditLogs(filters: AuditLogFilters) {
	const {
		userId,
		action,
		resource,
		dateFrom,
		dateTo,
		page = 1,
		limit = 20,
	} = filters;

	const query: Record<string, unknown> = {};
	if (userId) query.userId = userId;
	if (action) query.action = action;
	if (resource) query.resource = resource;
	if (dateFrom || dateTo) {
		const dateRange: Record<string, Date> = {};
		if (dateFrom) dateRange.$gte = new Date(dateFrom);
		if (dateTo) dateRange.$lte = new Date(dateTo);
		query.occurredAt = dateRange;
	}

	const skip = (page - 1) * limit;
	const [logs, total] = await Promise.all([
		AuditLogModel.find(query)
			.sort({ occurredAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		AuditLogModel.countDocuments(query),
	]);

	// Fetch user details for logs to resolve user first/last names
	const userIds = Array.from(new Set(logs.map((log) => log.userId).filter((id): id is string => !!id)));
	const users = await UserModel.find({ id: { $in: userIds } })
		.select('id firstName lastName email')
		.lean();
	const userMap = new Map(users.map((u) => [u.id, u]));

	const populatedLogs = logs.map((log) => {
		const cleanLog = cleanMongoFields(log);
		const user = log.userId ? userMap.get(log.userId) : undefined;
		return {
			...cleanLog,
			user: user
				? {
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email,
					}
				: undefined,
		};
	});

	return {
		data: populatedLogs,
		meta: metaInformation({ page, limit, total }),
	};
}
