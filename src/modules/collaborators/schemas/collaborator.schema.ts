import { z } from 'zod';
import { LocalizedHtmlStringSchema } from '@Shared/schemas/localizedString.schema';

const SocialLinksSchema = z.object({
	linkedin: z.url({ message: 'COLLABORATOR_SOCIAL_URL_INVALID' }).optional(),
	twitter: z.url({ message: 'COLLABORATOR_SOCIAL_URL_INVALID' }).optional(),
	github: z.url({ message: 'COLLABORATOR_SOCIAL_URL_INVALID' }).optional(),
	website: z.url({ message: 'COLLABORATOR_SOCIAL_URL_INVALID' }).optional(),
	instagram: z.url({ message: 'COLLABORATOR_SOCIAL_URL_INVALID' }).optional(),
});

export const CreateCollaboratorSchema = z.object({
	name: z.string().min(1).max(100).trim(),
	// Config API value (group 'collaboratorRoles') — a curated, admin-facing
	// picklist rather than free text, so it stays consistent across the team.
	// Not a strict enum here on purpose: the picklist is expected to evolve
	// (see product vision docs), and a hard enum would force this schema and
	// the config data list to change in lockstep.
	role: z.string().trim().min(1).max(50),
	level: z.string().trim().max(50).optional(),
	bio: LocalizedHtmlStringSchema,
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
	search: z.string().trim().max(200).optional(),
	isActive: z.coerce.boolean().optional(),
});

export type createCollaboratorInput = z.infer<typeof CreateCollaboratorSchema>;
export type updateCollaboratorInput = z.infer<typeof UpdateCollaboratorSchema>;
