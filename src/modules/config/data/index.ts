export interface LocalizedLabel {
	es: string;
	en: string;
}

export interface CurrencyDef {
	value: string;
	label: LocalizedLabel;
	symbol: string;
}

export interface DocumentTypeDef {
	value: string;
	label: LocalizedLabel;
	/** Validation regex (as a string) for the document number, if strict. */
	pattern?: string;
	maxLength?: number;
}

export interface LanguageDef {
	value: string;
	/** Endonym (native name) — no per-request localization needed. */
	label: string;
}

export interface IndustryDef {
	value: string;
	label: LocalizedLabel;
}

// ── Currencies (ISO 4217) ──────────────────────────────────────────────────────
export const CURRENCIES: CurrencyDef[] = [
	{ value: 'PEN', label: { es: 'Soles', en: 'Peruvian Sol' }, symbol: 'S/' },
	{ value: 'USD', label: { es: 'Dólares', en: 'US Dollar' }, symbol: '$' },
	{ value: 'EUR', label: { es: 'Euros', en: 'Euro' }, symbol: '€' },
	{ value: 'GBP', label: { es: 'Libras', en: 'British Pound' }, symbol: '£' },
	{ value: 'BRL', label: { es: 'Reales', en: 'Brazilian Real' }, symbol: 'R$' },
	{ value: 'MXN', label: { es: 'Pesos mexicanos', en: 'Mexican Peso' }, symbol: '$' },
	{ value: 'ARS', label: { es: 'Pesos argentinos', en: 'Argentine Peso' }, symbol: '$' },
	{ value: 'CLP', label: { es: 'Pesos chilenos', en: 'Chilean Peso' }, symbol: '$' },
	{ value: 'COP', label: { es: 'Pesos colombianos', en: 'Colombian Peso' }, symbol: '$' },
];

// ── Document types (aligned with clients DOCUMENT_TYPES) ────────────────────────
export const DOCUMENT_TYPES: DocumentTypeDef[] = [
	{ value: 'DNI', label: { es: 'DNI', en: 'DNI' }, pattern: '^\\d{8}$', maxLength: 8 },
	{ value: 'RUC', label: { es: 'RUC', en: 'RUC' }, pattern: '^\\d{11}$', maxLength: 11 },
	{ value: 'CE', label: { es: 'Carné de extranjería', en: 'Foreign ID' }, maxLength: 12 },
	{ value: 'NIF', label: { es: 'NIF', en: 'NIF' }, maxLength: 12 },
	{ value: 'CIF', label: { es: 'CIF', en: 'CIF' }, maxLength: 12 },
	{ value: 'CNPJ', label: { es: 'CNPJ', en: 'CNPJ' }, pattern: '^\\d{14}$', maxLength: 14 },
	{ value: 'CPF', label: { es: 'CPF', en: 'CPF' }, pattern: '^\\d{11}$', maxLength: 11 },
	{ value: 'EIN', label: { es: 'EIN', en: 'EIN' }, maxLength: 12 },
	{ value: 'SSN', label: { es: 'SSN', en: 'SSN' }, maxLength: 12 },
	{ value: 'VAT', label: { es: 'VAT', en: 'VAT' }, maxLength: 20 },
	{ value: 'PASSPORT', label: { es: 'Pasaporte', en: 'Passport' }, maxLength: 12 },
	{ value: 'OTHER', label: { es: 'Otro', en: 'Other' }, maxLength: 50 },
];

// ── Supported languages (endonyms) ─────────────────────────────────────────────
export const LANGUAGES: LanguageDef[] = [
	{ value: 'es', label: 'Español' },
	{ value: 'en', label: 'English' },
	{ value: 'de', label: 'Deutsch' },
	{ value: 'fr', label: 'Français' },
	{ value: 'it', label: 'Italiano' },
	{ value: 'pt', label: 'Português' },
	{ value: 'ja', label: '日本語' },
	{ value: 'ko', label: '한국어' },
	{ value: 'ru', label: 'Русский' },
	{ value: 'zh', label: '中文' },
];

// ── Industries (base list) ─────────────────────────────────────────────────────
export const INDUSTRIES: IndustryDef[] = [
	{ value: 'technology', label: { es: 'Tecnología', en: 'Technology' } },
	{ value: 'finance', label: { es: 'Finanzas', en: 'Finance' } },
	{ value: 'healthcare', label: { es: 'Salud', en: 'Healthcare' } },
	{ value: 'education', label: { es: 'Educación', en: 'Education' } },
	{ value: 'retail', label: { es: 'Comercio minorista', en: 'Retail' } },
	{ value: 'manufacturing', label: { es: 'Manufactura', en: 'Manufacturing' } },
	{ value: 'construction', label: { es: 'Construcción', en: 'Construction' } },
	{ value: 'real_estate', label: { es: 'Inmobiliaria', en: 'Real Estate' } },
	{ value: 'hospitality', label: { es: 'Hotelería y turismo', en: 'Hospitality & Tourism' } },
	{ value: 'food_beverage', label: { es: 'Alimentos y bebidas', en: 'Food & Beverage' } },
	{ value: 'logistics', label: { es: 'Transporte y logística', en: 'Transport & Logistics' } },
	{ value: 'agriculture', label: { es: 'Agricultura', en: 'Agriculture' } },
	{ value: 'energy', label: { es: 'Energía', en: 'Energy' } },
	{ value: 'mining', label: { es: 'Minería', en: 'Mining' } },
	{ value: 'telecommunications', label: { es: 'Telecomunicaciones', en: 'Telecommunications' } },
	{ value: 'media', label: { es: 'Medios y entretenimiento', en: 'Media & Entertainment' } },
	{ value: 'professional_services', label: { es: 'Servicios profesionales', en: 'Professional Services' } },
	{ value: 'legal', label: { es: 'Legal', en: 'Legal' } },
	{ value: 'marketing', label: { es: 'Marketing y publicidad', en: 'Marketing & Advertising' } },
	{ value: 'automotive', label: { es: 'Automotriz', en: 'Automotive' } },
	{ value: 'pharmaceutical', label: { es: 'Farmacéutica', en: 'Pharmaceutical' } },
	{ value: 'insurance', label: { es: 'Seguros', en: 'Insurance' } },
	{ value: 'ecommerce', label: { es: 'Comercio electrónico', en: 'E-commerce' } },
	{ value: 'consulting', label: { es: 'Consultoría', en: 'Consulting' } },
	{ value: 'nonprofit', label: { es: 'Sin fines de lucro', en: 'Nonprofit' } },
	{ value: 'government', label: { es: 'Gobierno', en: 'Government' } },
	{ value: 'other', label: { es: 'Otro', en: 'Other' } },
];
