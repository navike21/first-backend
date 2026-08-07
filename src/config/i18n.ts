import i18next from 'i18next';
import { locales, SUPPORTED_LANGS } from '../locales';
import { authLocales } from '../modules/auth/locales';
import { usersLocales } from '../modules/users/locales';
import { userGroupsLocales } from '../modules/user-groups/locales';
import { subscribersLocales } from '../modules/subscribers/locales';
import { storageLocales } from '../modules/storage/locales';
import { auditLogLocales } from '../modules/audit-log/locales';
import { appSettingsLocales } from '../modules/app-settings/locales';
import { clientsLocales } from '../modules/clients/locales';
import { servicesLocales } from '../modules/services/locales';
import { portfolioLocales } from '../modules/portfolio/locales';
import { pagesLocales } from '../modules/pages/locales';
import { collaboratorsLocales } from '../modules/collaborators/locales';
import { categoriesLocales } from '../modules/categories/locales';
import { tagsLocales } from '../modules/tags/locales';
import { siteConfigLocales } from '../modules/site-config/locales';
import { formsLocales } from '../modules/forms/locales';
import { blogLocales } from '../modules/blog/locales';
import { ecommerceSettingsLocales } from '../modules/ecommerce-settings/locales';
import { productCategoriesLocales } from '../modules/product-categories/locales';
import { customersLocales } from '../modules/customers/locales';
import { customerAuthLocales } from '../modules/customer-auth/locales';
import { inventoryLocales } from '../modules/inventory/locales';
import { productsLocales } from '../modules/products/locales';
import { cartLocales } from '../modules/cart/locales';
import { wishlistLocales } from '../modules/wishlist/locales';
import { couponsLocales } from '../modules/coupons/locales';

export async function initI18n(): Promise<void> {
	const resources = Object.fromEntries(
		SUPPORTED_LANGS.map((lang) => [
			lang,
			{
				errors: locales[lang],
				auth: authLocales[lang],
				users: usersLocales[lang],
				'user-groups': userGroupsLocales[lang],
				subscribers: subscribersLocales[lang],
				storage: storageLocales[lang],
				'audit-log': auditLogLocales[lang],
				'app-settings': appSettingsLocales[lang],
				clients: clientsLocales[lang],
				services: servicesLocales[lang],
				portfolio: portfolioLocales[lang],
				pages: pagesLocales[lang],
				collaborators: collaboratorsLocales[lang],
				categories: categoriesLocales[lang],
				tags: tagsLocales[lang],
				'site-config': siteConfigLocales[lang],
				forms: formsLocales[lang],
				blog: blogLocales[lang],
				'ecommerce-settings': ecommerceSettingsLocales[lang],
				'product-categories': productCategoriesLocales[lang],
				customers: customersLocales[lang],
				'customer-auth': customerAuthLocales[lang],
				inventory: inventoryLocales[lang],
				products: productsLocales[lang],
				cart: cartLocales[lang],
				wishlist: wishlistLocales[lang],
				coupons: couponsLocales[lang],
			},
		]),
	);

	await i18next.init({
		lng: 'en',
		fallbackLng: 'en',
		supportedLngs: SUPPORTED_LANGS,
		resources,
		interpolation: { escapeValue: false },
		ns: [
			'errors',
			'auth',
			'users',
			'user-groups',
			'subscribers',
			'storage',
			'audit-log',
			'app-settings',
			'clients',
			'services',
			'portfolio',
			'pages',
			'collaborators',
			'categories',
			'tags',
			'site-config',
			'forms',
			'blog',
			'ecommerce-settings',
			'product-categories',
			'customers',
			'customer-auth',
			'inventory',
			'products',
			'cart',
			'wishlist',
			'coupons',
		],
		defaultNS: 'errors',
	});
}

export default i18next;
