import ClientModel from '@Modules/clients/infrastructure/ClientModel';
import UserModel from '@Modules/users/infrastructure/UserModel';
import CollaboratorModel from '@Modules/collaborators/infrastructure/CollaboratorModel';
import PortfolioModel from '@Modules/portfolio/infrastructure/PortfolioModel';
import ServiceModel from '@Modules/services/infrastructure/ServiceModel';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import AppSettingsModel from '@Modules/app-settings/infrastructure/AppSettingsModel';

export type StorageUsageModule =
	| 'clients'
	| 'users'
	| 'collaborators'
	| 'portfolio'
	| 'services'
	| 'pages'
	| 'app-settings';

export type StorageUsageContext = 'cover' | 'gallery' | 'ogImage' | 'background' | 'logo' | 'favicon';

export interface StorageFileUsage {
	module: StorageUsageModule;
	id: string;
	label: string;
	context?: StorageUsageContext;
}

type LocalizedValue = Record<string, string> | null | undefined;

// No backend helper resolves LocalizedString -> a single label (the frontend
// always does `name[lang] || name.en` with the viewer's own language). This
// admin-only usage list has no "viewer language" to key off, so it falls back
// to es -> en -> first non-empty value, matching this app's primary language.
function resolveLocalizedLabel(value: LocalizedValue, fallback: string): string {
	if (!value) return fallback;
	return value.es || value.en || Object.values(value).find((v) => v) || fallback;
}

/**
 * Finds every place across the app that stores `url` as a plain string field
 * (no module holds a live reference to `StorageFile` — see the module's own
 * docs). Purely informational: used by the Multimedia admin page to show
 * "used in..." before a purge, never to block it.
 *
 * Known gap: images pasted inside a page's rich-text section content aren't
 * detected (that content is an unstructured Mixed blob, not a queryable URL
 * field) — surfaced to the admin as a caveat in the UI, not solved here.
 */
export async function findStorageFileUsages(url: string): Promise<StorageFileUsage[]> {
	const [clients, users, collaborators, portfolioItems, services, pages, appSettings] = await Promise.all([
		ClientModel.find({ logoUrl: url }).select('id businessName').lean(),
		UserModel.find({ profilePictureUrl: url }).select('id firstName lastName email').lean(),
		CollaboratorModel.find({ photoUrl: url }).select('id name').lean(),
		PortfolioModel.find({ $or: [{ coverImageUrl: url }, { gallery: url }] })
			.select('id name coverImageUrl')
			.lean(),
		ServiceModel.find({ coverImageUrl: url }).select('id name').lean(),
		PageModel.find({
			$or: [
				{ coverImageUrl: url },
				{ 'seo.ogImage': url },
				{ 'sections.settings.background.desktop.url': url },
				{ 'sections.settings.background.tablet.url': url },
				{ 'sections.settings.background.mobile.url': url },
				{ 'sections.settings.background.desktop.files.url': url },
				{ 'sections.settings.background.tablet.files.url': url },
				{ 'sections.settings.background.mobile.files.url': url },
			],
		})
			.select('id title coverImageUrl seo')
			.lean(),
		AppSettingsModel.findOne({ id: 'singleton' }).select('appearance').lean(),
	]);

	const usages: StorageFileUsage[] = [];

	for (const c of clients) usages.push({ module: 'clients', id: c.id, label: c.businessName });

	for (const u of users) {
		const name = `${u.firstName} ${u.lastName}`.trim();
		usages.push({ module: 'users', id: u.id, label: name || u.email });
	}

	for (const c of collaborators) usages.push({ module: 'collaborators', id: c.id, label: c.name });

	for (const p of portfolioItems) {
		usages.push({
			module: 'portfolio',
			id: p.id,
			label: resolveLocalizedLabel(p.name, p.id),
			context: p.coverImageUrl === url ? 'cover' : 'gallery',
		});
	}

	for (const s of services) usages.push({ module: 'services', id: s.id, label: resolveLocalizedLabel(s.name, s.id) });

	for (const p of pages) {
		let context: StorageUsageContext = 'background';
		if (p.coverImageUrl === url) context = 'cover';
		else if (p.seo?.ogImage === url) context = 'ogImage';
		usages.push({ module: 'pages', id: p.id, label: resolveLocalizedLabel(p.title, p.id), context });
	}

	if (appSettings?.appearance?.logoUrl === url) {
		usages.push({ module: 'app-settings', id: 'singleton', label: '', context: 'logo' });
	}
	if (appSettings?.appearance?.faviconUrl === url) {
		usages.push({ module: 'app-settings', id: 'singleton', label: '', context: 'favicon' });
	}

	return usages;
}
