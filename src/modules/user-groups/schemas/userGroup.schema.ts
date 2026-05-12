import { z } from 'zod';
import { ALL_PERMISSIONS } from '@Constants/permissions';

const permissionEnum = z.enum(ALL_PERMISSIONS);

export const CreateUserGroupSchema = z.object({
	name: z.string().min(2).max(80).trim(),
	description: z.string().max(255).trim().optional(),
	permissions: z.array(permissionEnum).default([]),
	color: z
		.string()
		.regex(
			/^#[0-9A-Fa-f]{6}$/,
			'Color must be a valid hex color (e.g. #6366f1)',
		)
		.default('#6366f1'),
	status: z.enum(['active', 'inactive']).default('active'),
});

export const UpdateUserGroupSchema = CreateUserGroupSchema.partial();

export const ListUserGroupsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	status: z.enum(['active', 'inactive']).optional(),
	search: z.string().optional(),
});

export type CreateUserGroupInput = z.infer<typeof CreateUserGroupSchema>;
export type UpdateUserGroupInput = z.infer<typeof UpdateUserGroupSchema>;
export type ListUserGroupsQuery = z.infer<typeof ListUserGroupsQuerySchema>;
