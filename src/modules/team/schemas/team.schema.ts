import { z } from 'zod';
import { LocalizedStringSchema } from '@Shared/schemas/localizedString.schema';

const SocialLinksSchema = z.object({
	linkedin: z.url({ message: 'TEAM_SOCIAL_URL_INVALID' }).optional(),
	twitter: z.url({ message: 'TEAM_SOCIAL_URL_INVALID' }).optional(),
	github: z.url({ message: 'TEAM_SOCIAL_URL_INVALID' }).optional(),
	website: z.url({ message: 'TEAM_SOCIAL_URL_INVALID' }).optional(),
	instagram: z.url({ message: 'TEAM_SOCIAL_URL_INVALID' }).optional(),
});

export const CreateTeamMemberSchema = z.object({
	name: z.string().min(1).max(100).trim(),
	role: LocalizedStringSchema,
	bio: LocalizedStringSchema,
	photoUrl: z.url({ message: 'TEAM_PHOTO_URL_INVALID' }).optional(),
	socialLinks: SocialLinksSchema.optional(),
	order: z.coerce.number().int().default(0),
	isActive: z.boolean().default(true),
});

export const UpdateTeamMemberSchema = CreateTeamMemberSchema.partial();

export const ListTeamQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateTeamMemberInput = z.infer<typeof CreateTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof UpdateTeamMemberSchema>;
