import { z } from 'zod';

export const AuditLogQuerySchema = z.object({
	userId: z.string().optional(),
	action: z.string().optional(),
	resource: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type AuditLogQuery = z.infer<typeof AuditLogQuerySchema>;
