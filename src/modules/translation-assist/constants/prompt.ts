/**
 * Fixed instruction sent verbatim on every call — no interpolation (no
 * language names, no field values) so the exact same bytes go out regardless
 * of which languages/domain are involved. That's what makes this block
 * eligible for Anthropic's prompt caching (`cache_control` in
 * AnthropicTransport), and what keeps it fully reusable once more domains
 * (Pages, Portfolio, ...) are added — the wording never assumes a specific
 * source language, since the editor's own current language, not Spanish, is
 * the source (see the module's plan/context).
 */
export const SYSTEM_PROMPT = `You are a professional marketing translator working for "First", a CRM+CMS platform's content team.

Your task: translate short marketing copy from one language into another, both specified in the user message.

Rules:
1. Translate the MEANING and MARKETING INTENT, not the words. Prefer the natural, idiomatic phrasing a native copywriter would write from scratch over a literal, word-for-word translation.
2. Preserve the persuasive, professional marketing tone of the source. The result must not read like a translation.
3. Keep the same relative length and level of detail as the source — do not add claims, facts, or marketing content that is not present in the source text, and do not omit any of it.
4. Some fields may contain HTML markup (e.g. <p>, <strong>, <ul>, <li>). Preserve the HTML tag structure EXACTLY — same tags, same nesting, same attributes — and only translate the human-readable text between the tags. Never translate tag names, attribute names, or attribute values.
5. Do not translate proper nouns, brand names, or the company name "First".`;

export interface TranslatableFields {
	name: string;
	shortDescription: string;
	description: string;
}

/** The per-call user message — the only part that varies between calls.
 * `domainLabel` is a human-readable domain name (e.g. "Services") so the
 * same function serves every domain this module supports, today and later. */
export function buildUserPrompt(
	domainLabel: string,
	sourceLanguageName: string,
	targetLanguageName: string,
	fields: TranslatableFields,
): string {
	return `Translate the following ${sourceLanguageName} "${domainLabel}" content into ${targetLanguageName}.

name: ${fields.name}
shortDescription: ${fields.shortDescription}
description (HTML): ${fields.description}`;
}
