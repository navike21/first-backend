import generateUUID from '@Helpers/uuid';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { generateSlug } from '@Helpers/generateSlug';
import { AppError } from '@Shared/domain/AppError';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';
import type { LocalizedString } from '@Shared/types/localizedString';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import { BlogSlugConflictError } from '../domain/errors/BlogErrors';
import BlogModel from '../infrastructure/BlogModel';
import { BLOG_ENTITY_TYPE } from '../constants/paths';
import type { CreateBlogInput } from '../schemas/blog.schema';

export interface BlogPostFiles {
	cover?: IncomingFile;
	ogImage?: IncomingFile;
}

/** Per-language slug: whatever the client sent, defaulting each empty
 * language to a slugified version of that language's own title — mirrors
 * Portfolio/Pages' own slug-resolution logic. */
function resolveSlug(input: CreateBlogInput): LocalizedString {
	return Object.fromEntries(
		SUPPORTED_LANGUAGES.map((l) => [
			l,
			input.slug?.[l]?.trim() || generateSlug(input.title[l] ?? ''),
		]),
	) as LocalizedString;
}

async function checkSlugConflict(slug: LocalizedString): Promise<void> {
	const entries = Object.entries(slug).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const existing = await BlogModel.findOne({ $or: orQuery });
	if (existing) throw new BlogSlugConflictError();
}

interface CoverResolution {
	coverImageUrl: string;
	warning?: ResponseWarning;
}

/**
 * Resolves the cover for a new post: uploads `file` if provided, else falls
 * back to `inputUrl`. The cover is required, so this throws when neither
 * yields one — mirrors `portfolio/application/createPortfolio.ts`.
 */
async function resolveCoverOrThrow(
	id: string,
	inputUrl: string | undefined,
	file: IncomingFile | undefined,
	uploadedBy: string | undefined,
): Promise<CoverResolution> {
	if (!file) {
		if (inputUrl) return { coverImageUrl: inputUrl };
		AppError.unprocessable('BLOG_COVER_REQUIRED', 'A cover image is required');
	}

	const uploaded = await uploadImageSafe({
		buffer: file.buffer,
		originalName: file.originalName,
		mimeType: file.mimeType,
		entityType: BLOG_ENTITY_TYPE,
		entityId: id,
		field: 'cover',
		uploadedBy,
	});
	if (uploaded.url) return { coverImageUrl: uploaded.url, warning: uploaded.warning };

	if (uploaded.warning) {
		AppError.unprocessable(
			'BLOG_COVER_UPLOAD_FAILED',
			uploaded.warning.message,
			uploaded.warning,
		);
	}
	AppError.unprocessable('BLOG_COVER_REQUIRED', 'A cover image is required');
}

async function uploadOgImageIfProvided(
	id: string,
	uploadedBy: string | undefined,
	file: IncomingFile | undefined,
	warnings: ResponseWarning[],
): Promise<string | undefined> {
	if (!file) return undefined;
	const uploaded = await uploadImageSafe({
		buffer: file.buffer,
		originalName: file.originalName,
		mimeType: file.mimeType,
		entityType: BLOG_ENTITY_TYPE,
		entityId: id,
		field: 'ogImage',
		uploadedBy,
	});
	if (uploaded.warning) warnings.push(uploaded.warning);
	return uploaded.url;
}

export async function createBlogPost(
	input: CreateBlogInput,
	files: BlogPostFiles | undefined,
	uploadedBy?: string,
): Promise<MutationResult<Record<string, unknown>>> {
	const slug = resolveSlug(input);
	await checkSlugConflict(slug);

	const id = generateUUID();
	const warnings: ResponseWarning[] = [];

	const cover = await resolveCoverOrThrow(
		id,
		input.coverImageUrl,
		files?.cover,
		uploadedBy,
	);
	const coverImageUrl = cover.coverImageUrl;
	if (cover.warning) warnings.push(cover.warning);

	// '' means "no image" on create — normalize so the document never stores ''.
	let seo = input.seo?.ogImage === '' ? { ...input.seo, ogImage: undefined } : input.seo;
	const ogImageUrl = await uploadOgImageIfProvided(
		id,
		uploadedBy,
		files?.ogImage,
		warnings,
	);
	if (ogImageUrl) seo = { ...(seo ?? {}), ogImage: ogImageUrl };

	try {
		const post = await BlogModel.create({
			...input,
			id,
			slug,
			coverImageUrl,
			seo,
		});
		return {
			data: cleanMongoFields(
				post.toObject({ versionKey: false, getters: true }),
			),
			warnings,
		};
	} catch (error) {
		if (files?.cover || files?.ogImage) {
			await deleteEntityFiles(BLOG_ENTITY_TYPE, id).catch(() => {});
		}
		throw error;
	}
}
