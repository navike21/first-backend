import { z } from 'zod';
import { LocalizedStringSchema } from '@Shared/schemas/localizedString.schema';

const SocialLinksSchema = z.object({
	linkedin: z.url({ message: 'COLLABORATOR_SOCIAL_URL_INVALID' }).optional(),
	twitter: z.url({ message: 'COLLABORATOR_SOCIAL_URL_INVALID' }).optional(),
	github: z.url({ message: 'COLLABORATOR_SOCIAL_URL_INVALID' }).optional(),
	website: z.url({ message: 'COLLABORATOR_SOCIAL_URL_INVALID' }).optional(),
	instagram: z.url({ message: 'COLLABORATOR_SOCIAL_URL_INVALID' }).optional(),
});

export const CreateCollaboratorSchema = z.object({
	name: z.string().min(1).max(100).trim(),
	role: LocalizedStringSchema,
	bio: LocalizedStringSchema,
	photoUrl: z.url({ message: 'COLLABORATOR_PHOTO_URL_INVALID' }).optional(),
	socialLinks: SocialLinksSchema.optional(),
	// Optional link to a system user, so an employee shown publicly is not a
	// duplicate identity (users = access; collaborators = public CMS profile).
	userId: z.uuid({ message: 'COLLABORATOR_USER_ID_INVALID' }).optional(),
	order: z.coerce.number().int().default(0),
	isActive: z.boolean().default(true),
});

export const UpdateCollaboratorSchema = CreateCollaboratorSchema.partial();

export const ListCollaboratorQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type createCollaboratorInput = z.infer<typeof CreateCollaboratorSchema>;
export type updateCollaboratorInput = z.infer<typeof UpdateCollaboratorSchema>;
