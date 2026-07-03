export interface LocalizedLabel {
	es: string;
	en: string;
	de: string;
	fr: string;
	it: string;
	pt: string;
	ja: string;
	ko: string;
	zh: string;
	ru: string;
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
	{
		value: 'PEN',
		label: { es: 'Soles', en: 'Peruvian Sol', de: 'Peruanischer Sol', fr: 'Sol péruvien', it: 'Sol peruviano', pt: 'Sol peruano', ja: 'ペルーソル', ko: '페루 솔', zh: '秘鲁索尔', ru: 'Перуанский соль' },
		symbol: 'S/',
	},
	{
		value: 'USD',
		label: { es: 'Dólares', en: 'US Dollar', de: 'US-Dollar', fr: 'Dollar américain', it: 'Dollaro americano', pt: 'Dólar americano', ja: '米ドル', ko: '미국 달러', zh: '美元', ru: 'Доллар США' },
		symbol: '$',
	},
	{
		value: 'EUR',
		label: { es: 'Euros', en: 'Euro', de: 'Euro', fr: 'Euro', it: 'Euro', pt: 'Euro', ja: 'ユーロ', ko: '유로', zh: '欧元', ru: 'Евро' },
		symbol: '€',
	},
	{
		value: 'GBP',
		label: { es: 'Libras', en: 'British Pound', de: 'Britisches Pfund', fr: 'Livre sterling', it: 'Sterlina britannica', pt: 'Libra esterlina', ja: '英国ポンド', ko: '영국 파운드', zh: '英镑', ru: 'Британский фунт' },
		symbol: '£',
	},
	{
		value: 'BRL',
		label: { es: 'Reales', en: 'Brazilian Real', de: 'Brasilianischer Real', fr: 'Réal brésilien', it: 'Real brasiliano', pt: 'Real brasileiro', ja: 'ブラジルレアル', ko: '브라질 헤알', zh: '巴西雷亚尔', ru: 'Бразильский реал' },
		symbol: 'R$',
	},
	{
		value: 'MXN',
		label: { es: 'Pesos mexicanos', en: 'Mexican Peso', de: 'Mexikanischer Peso', fr: 'Peso mexicain', it: 'Peso messicano', pt: 'Peso mexicano', ja: 'メキシコペソ', ko: '멕시코 페소', zh: '墨西哥比索', ru: 'Мексиканский песо' },
		symbol: '$',
	},
	{
		value: 'ARS',
		label: { es: 'Pesos argentinos', en: 'Argentine Peso', de: 'Argentinischer Peso', fr: 'Peso argentin', it: 'Peso argentino', pt: 'Peso argentino', ja: 'アルゼンチンペソ', ko: '아르헨티나 페소', zh: '阿根廷比索', ru: 'Аргентинский песо' },
		symbol: '$',
	},
	{
		value: 'CLP',
		label: { es: 'Pesos chilenos', en: 'Chilean Peso', de: 'Chilenischer Peso', fr: 'Peso chilien', it: 'Peso cileno', pt: 'Peso chileno', ja: 'チリペソ', ko: '칠레 페소', zh: '智利比索', ru: 'Чилийский песо' },
		symbol: '$',
	},
	{
		value: 'COP',
		label: { es: 'Pesos colombianos', en: 'Colombian Peso', de: 'Kolumbianischer Peso', fr: 'Peso colombien', it: 'Peso colombiano', pt: 'Peso colombiano', ja: 'コロンビアペソ', ko: '콜롬비아 페소', zh: '哥伦比亚比索', ru: 'Колумбийский песо' },
		symbol: '$',
	},
];

// ── Document types (aligned with clients DOCUMENT_TYPES) ────────────────────────
export const DOCUMENT_TYPES: DocumentTypeDef[] = [
	{ value: 'DNI', label: { es: 'DNI', en: 'DNI', de: 'DNI', fr: 'DNI', it: 'DNI', pt: 'DNI', ja: 'DNI', ko: 'DNI', zh: 'DNI', ru: 'DNI' }, pattern: '^\\d{8}$', maxLength: 8 },
	{ value: 'RUC', label: { es: 'RUC', en: 'RUC', de: 'RUC', fr: 'RUC', it: 'RUC', pt: 'RUC', ja: 'RUC', ko: 'RUC', zh: 'RUC', ru: 'RUC' }, pattern: '^\\d{11}$', maxLength: 11 },
	{
		value: 'CE',
		label: { es: 'Carné de extranjería', en: 'Foreign ID', de: 'Aufenthaltstitel', fr: 'Titre de séjour', it: 'Permesso di soggiorno', pt: 'Carteira de estrangeiro', ja: '外国人登録証', ko: '외국인 등록증', zh: '外籍居留证', ru: 'Вид на жительство' },
		maxLength: 12,
	},
	{ value: 'NIF', label: { es: 'NIF', en: 'NIF', de: 'NIF', fr: 'NIF', it: 'NIF', pt: 'NIF', ja: 'NIF', ko: 'NIF', zh: 'NIF', ru: 'NIF' }, maxLength: 12 },
	{ value: 'CIF', label: { es: 'CIF', en: 'CIF', de: 'CIF', fr: 'CIF', it: 'CIF', pt: 'CIF', ja: 'CIF', ko: 'CIF', zh: 'CIF', ru: 'CIF' }, maxLength: 12 },
	{ value: 'CNPJ', label: { es: 'CNPJ', en: 'CNPJ', de: 'CNPJ', fr: 'CNPJ', it: 'CNPJ', pt: 'CNPJ', ja: 'CNPJ', ko: 'CNPJ', zh: 'CNPJ', ru: 'CNPJ' }, pattern: '^\\d{14}$', maxLength: 14 },
	{ value: 'CPF', label: { es: 'CPF', en: 'CPF', de: 'CPF', fr: 'CPF', it: 'CPF', pt: 'CPF', ja: 'CPF', ko: 'CPF', zh: 'CPF', ru: 'CPF' }, pattern: '^\\d{11}$', maxLength: 11 },
	{ value: 'EIN', label: { es: 'EIN', en: 'EIN', de: 'EIN', fr: 'EIN', it: 'EIN', pt: 'EIN', ja: 'EIN', ko: 'EIN', zh: 'EIN', ru: 'EIN' }, maxLength: 12 },
	{ value: 'SSN', label: { es: 'SSN', en: 'SSN', de: 'SSN', fr: 'SSN', it: 'SSN', pt: 'SSN', ja: 'SSN', ko: 'SSN', zh: 'SSN', ru: 'SSN' }, maxLength: 12 },
	{ value: 'VAT', label: { es: 'VAT', en: 'VAT', de: 'VAT', fr: 'VAT', it: 'VAT', pt: 'VAT', ja: 'VAT', ko: 'VAT', zh: 'VAT', ru: 'VAT' }, maxLength: 20 },
	{
		value: 'PASSPORT',
		label: { es: 'Pasaporte', en: 'Passport', de: 'Reisepass', fr: 'Passeport', it: 'Passaporto', pt: 'Passaporte', ja: 'パスポート', ko: '여권', zh: '护照', ru: 'Паспорт' },
		maxLength: 12,
	},
	{
		value: 'OTHER',
		label: { es: 'Otro', en: 'Other', de: 'Sonstiges', fr: 'Autre', it: 'Altro', pt: 'Outro', ja: 'その他', ko: '기타', zh: '其他', ru: 'Другое' },
		maxLength: 50,
	},
];

// ── Supported languages (endonyms — used by the language switcher, not the config API) ──
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

// ── Client types ───────────────────────────────────────────────────────────────
export const CLIENT_TYPES: IndustryDef[] = [
	{ value: 'person', label: { es: 'Persona', en: 'Person', de: 'Person', fr: 'Personne', it: 'Persona', pt: 'Pessoa', ja: '個人', ko: '개인', zh: '个人', ru: 'Физическое лицо' } },
	{ value: 'company', label: { es: 'Empresa', en: 'Company', de: 'Unternehmen', fr: 'Entreprise', it: 'Azienda', pt: 'Empresa', ja: '法人', ko: '법인', zh: '企业', ru: 'Юридическое лицо' } },
];

// ── Genders ────────────────────────────────────────────────────────────────────
export const GENDERS: IndustryDef[] = [
	{ value: 'female', label: { es: 'Femenino', en: 'Female', de: 'Weiblich', fr: 'Féminin', it: 'Femminile', pt: 'Feminino', ja: '女性', ko: '여성', zh: '女', ru: 'Женский' } },
	{ value: 'male', label: { es: 'Masculino', en: 'Male', de: 'Männlich', fr: 'Masculin', it: 'Maschile', pt: 'Masculino', ja: '男性', ko: '남성', zh: '男', ru: 'Мужской' } },
	{ value: 'other', label: { es: 'Otro', en: 'Other', de: 'Divers', fr: 'Autre', it: 'Altro', pt: 'Outro', ja: 'その他', ko: '기타', zh: '其他', ru: 'Другое' } },
	{ value: 'prefer_not_to_say', label: { es: 'Prefiero no decir', en: 'Prefer not to say', de: 'Keine Angabe', fr: 'Préfère ne pas préciser', it: 'Preferisco non dirlo', pt: 'Prefiro não dizer', ja: '回答しない', ko: '응답하지 않음', zh: '不愿透露', ru: 'Не указывать' } },
];

// ── Industries ─────────────────────────────────────────────────────────────────
export const INDUSTRIES: IndustryDef[] = [
	{ value: 'technology', label: { es: 'Tecnología', en: 'Technology', de: 'Technologie', fr: 'Technologie', it: 'Tecnologia', pt: 'Tecnologia', ja: 'テクノロジー', ko: '기술', zh: '科技', ru: 'Технологии' } },
	{ value: 'finance', label: { es: 'Finanzas', en: 'Finance', de: 'Finanzen', fr: 'Finance', it: 'Finanza', pt: 'Finanças', ja: '金融', ko: '금융', zh: '金融', ru: 'Финансы' } },
	{ value: 'healthcare', label: { es: 'Salud', en: 'Healthcare', de: 'Gesundheitswesen', fr: 'Santé', it: 'Sanità', pt: 'Saúde', ja: '医療・健康', ko: '의료', zh: '医疗健康', ru: 'Здравоохранение' } },
	{ value: 'education', label: { es: 'Educación', en: 'Education', de: 'Bildung', fr: 'Éducation', it: 'Istruzione', pt: 'Educação', ja: '教育', ko: '교육', zh: '教育', ru: 'Образование' } },
	{ value: 'retail', label: { es: 'Comercio minorista', en: 'Retail', de: 'Einzelhandel', fr: 'Commerce de détail', it: 'Commercio al dettaglio', pt: 'Varejo', ja: '小売', ko: '소매', zh: '零售', ru: 'Розничная торговля' } },
	{ value: 'manufacturing', label: { es: 'Manufactura', en: 'Manufacturing', de: 'Fertigung', fr: 'Fabrication', it: 'Manifattura', pt: 'Manufatura', ja: '製造業', ko: '제조업', zh: '制造业', ru: 'Производство' } },
	{ value: 'construction', label: { es: 'Construcción', en: 'Construction', de: 'Bauwesen', fr: 'Construction', it: 'Costruzioni', pt: 'Construção', ja: '建設', ko: '건설', zh: '建筑', ru: 'Строительство' } },
	{ value: 'real_estate', label: { es: 'Inmobiliaria', en: 'Real Estate', de: 'Immobilien', fr: 'Immobilier', it: 'Immobiliare', pt: 'Imóveis', ja: '不動産', ko: '부동산', zh: '房地产', ru: 'Недвижимость' } },
	{ value: 'hospitality', label: { es: 'Hotelería y turismo', en: 'Hospitality & Tourism', de: 'Gastgewerbe & Tourismus', fr: 'Hôtellerie & Tourisme', it: 'Ospitalità & Turismo', pt: 'Hotelaria & Turismo', ja: 'ホスピタリティ・観光', ko: '숙박 및 관광', zh: '酒店与旅游', ru: 'Гостиничный бизнес и туризм' } },
	{ value: 'food_beverage', label: { es: 'Alimentos y bebidas', en: 'Food & Beverage', de: 'Lebensmittel & Getränke', fr: 'Alimentation & Boissons', it: 'Alimentare & Bevande', pt: 'Alimentos & Bebidas', ja: '食品・飲料', ko: '식음료', zh: '食品饮料', ru: 'Продукты питания и напитки' } },
	{ value: 'logistics', label: { es: 'Transporte y logística', en: 'Transport & Logistics', de: 'Transport & Logistik', fr: 'Transport & Logistique', it: 'Trasporti & Logistica', pt: 'Transporte & Logística', ja: '輸送・物流', ko: '운송 및 물류', zh: '运输与物流', ru: 'Транспорт и логистика' } },
	{ value: 'agriculture', label: { es: 'Agricultura', en: 'Agriculture', de: 'Landwirtschaft', fr: 'Agriculture', it: 'Agricoltura', pt: 'Agricultura', ja: '農業', ko: '농업', zh: '农业', ru: 'Сельское хозяйство' } },
	{ value: 'energy', label: { es: 'Energía', en: 'Energy', de: 'Energie', fr: 'Énergie', it: 'Energia', pt: 'Energia', ja: 'エネルギー', ko: '에너지', zh: '能源', ru: 'Энергетика' } },
	{ value: 'mining', label: { es: 'Minería', en: 'Mining', de: 'Bergbau', fr: 'Mines', it: 'Estrazione mineraria', pt: 'Mineração', ja: '鉱業', ko: '광업', zh: '采矿业', ru: 'Горнодобывающая промышленность' } },
	{ value: 'telecommunications', label: { es: 'Telecomunicaciones', en: 'Telecommunications', de: 'Telekommunikation', fr: 'Télécommunications', it: 'Telecomunicazioni', pt: 'Telecomunicações', ja: '通信', ko: '통신', zh: '电信', ru: 'Телекоммуникации' } },
	{ value: 'media', label: { es: 'Medios y entretenimiento', en: 'Media & Entertainment', de: 'Medien & Unterhaltung', fr: 'Médias & Divertissement', it: 'Media & Intrattenimento', pt: 'Mídia & Entretenimento', ja: 'メディア・エンターテインメント', ko: '미디어 및 엔터테인먼트', zh: '媒体与娱乐', ru: 'СМИ и развлечения' } },
	{ value: 'professional_services', label: { es: 'Servicios profesionales', en: 'Professional Services', de: 'Professionelle Dienstleistungen', fr: 'Services professionnels', it: 'Servizi professionali', pt: 'Serviços profissionais', ja: '専門サービス', ko: '전문 서비스', zh: '专业服务', ru: 'Профессиональные услуги' } },
	{ value: 'legal', label: { es: 'Legal', en: 'Legal', de: 'Rechtsberatung', fr: 'Juridique', it: 'Legale', pt: 'Jurídico', ja: '法律', ko: '법률', zh: '法律', ru: 'Юридические услуги' } },
	{ value: 'marketing', label: { es: 'Marketing y publicidad', en: 'Marketing & Advertising', de: 'Marketing & Werbung', fr: 'Marketing & Publicité', it: 'Marketing & Pubblicità', pt: 'Marketing & Publicidade', ja: 'マーケティング・広告', ko: '마케팅 및 광고', zh: '营销与广告', ru: 'Маркетинг и реклама' } },
	{ value: 'automotive', label: { es: 'Automotriz', en: 'Automotive', de: 'Automobilindustrie', fr: 'Automobile', it: 'Automotive', pt: 'Automotivo', ja: '自動車', ko: '자동차', zh: '汽车', ru: 'Автомобильная промышленность' } },
	{ value: 'pharmaceutical', label: { es: 'Farmacéutica', en: 'Pharmaceutical', de: 'Pharmaindustrie', fr: 'Pharmaceutique', it: 'Farmaceutico', pt: 'Farmacêutico', ja: '製薬', ko: '제약', zh: '制药', ru: 'Фармацевтика' } },
	{ value: 'insurance', label: { es: 'Seguros', en: 'Insurance', de: 'Versicherung', fr: 'Assurances', it: 'Assicurazioni', pt: 'Seguros', ja: '保険', ko: '보험', zh: '保险', ru: 'Страхование' } },
	{ value: 'ecommerce', label: { es: 'Comercio electrónico', en: 'E-commerce', de: 'E-Commerce', fr: 'Commerce électronique', it: 'E-commerce', pt: 'Comércio eletrônico', ja: 'Eコマース', ko: '전자상거래', zh: '电子商务', ru: 'Электронная коммерция' } },
	{ value: 'consulting', label: { es: 'Consultoría', en: 'Consulting', de: 'Beratung', fr: 'Conseil', it: 'Consulenza', pt: 'Consultoria', ja: 'コンサルティング', ko: '컨설팅', zh: '咨询', ru: 'Консалтинг' } },
	{ value: 'nonprofit', label: { es: 'Sin fines de lucro', en: 'Nonprofit', de: 'Gemeinnützig', fr: 'Organisme à but non lucratif', it: 'Non profit', pt: 'Sem fins lucrativos', ja: '非営利', ko: '비영리', zh: '非营利', ru: 'Некоммерческая организация' } },
	{ value: 'government', label: { es: 'Gobierno', en: 'Government', de: 'Regierung', fr: 'Gouvernement', it: 'Governo', pt: 'Governo', ja: '政府・行政', ko: '정부', zh: '政府', ru: 'Государственное управление' } },
	{ value: 'other', label: { es: 'Otro', en: 'Other', de: 'Sonstiges', fr: 'Autre', it: 'Altro', pt: 'Outro', ja: 'その他', ko: '기타', zh: '其他', ru: 'Другое' } },
];
