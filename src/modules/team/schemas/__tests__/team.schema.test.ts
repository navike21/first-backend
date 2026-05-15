import { describe, it, expect } from 'vitest';
import {
	CreateTeamMemberSchema,
	UpdateTeamMemberSchema,
	ListTeamQuerySchema,
} from '@Modules/team/schemas/team.schema';

const localizedName = {
	en: 'Developer',
	es: 'Desarrollador',
	de: 'Entwickler',
	fr: 'Développeur',
	it: 'Sviluppatore',
	ja: '開発者',
	ko: '개발자',
	pt: 'Desenvolvedor',
	ru: 'Разработчик',
	zh: '开发者',
};

const validMember = {
	name: 'Jane Doe',
	role: localizedName,
	bio: localizedName,
};

describe('team.schema', () => {
	it('CreateTeamMemberSchema parses valid minimal data', () => {
		const result = CreateTeamMemberSchema.safeParse(validMember);
		expect(result.success).toBe(true);
	});

	it('CreateTeamMemberSchema rejects missing name', () => {
		const result = CreateTeamMemberSchema.safeParse({
			role: localizedName,
			bio: localizedName,
		});
		expect(result.success).toBe(false);
	});

	it('CreateTeamMemberSchema rejects missing role', () => {
		const result = CreateTeamMemberSchema.safeParse({
			name: 'Jane',
			bio: localizedName,
		});
		expect(result.success).toBe(false);
	});

	it('CreateTeamMemberSchema rejects incomplete localizedString in role', () => {
		const result = CreateTeamMemberSchema.safeParse({
			name: 'Jane',
			role: { en: 'Developer' },
			bio: localizedName,
		});
		expect(result.success).toBe(false);
	});

	it('CreateTeamMemberSchema defaults order to 0 and isActive to true', () => {
		const result = CreateTeamMemberSchema.safeParse(validMember);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.order).toBe(0);
			expect(result.data.isActive).toBe(true);
		}
	});

	it('CreateTeamMemberSchema accepts optional socialLinks', () => {
		const result = CreateTeamMemberSchema.safeParse({
			...validMember,
			socialLinks: {
				linkedin: 'https://linkedin.com/in/jane',
				github: 'https://github.com/jane',
			},
		});
		expect(result.success).toBe(true);
	});

	it('CreateTeamMemberSchema rejects invalid URL in socialLinks', () => {
		const result = CreateTeamMemberSchema.safeParse({
			...validMember,
			socialLinks: { linkedin: 'not-a-url' },
		});
		expect(result.success).toBe(false);
	});

	it('CreateTeamMemberSchema coerces order string to number', () => {
		const result = CreateTeamMemberSchema.safeParse({
			...validMember,
			order: '3',
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.order).toBe(3);
	});

	it('UpdateTeamMemberSchema allows partial data', () => {
		const result = UpdateTeamMemberSchema.safeParse({ name: 'John' });
		expect(result.success).toBe(true);
	});

	it('UpdateTeamMemberSchema allows empty object', () => {
		const result = UpdateTeamMemberSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it('ListTeamQuerySchema defaults page and limit', () => {
		const result = ListTeamQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});

	it('ListTeamQuerySchema coerces string to number', () => {
		const result = ListTeamQuerySchema.safeParse({ page: '2', limit: '20' });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(2);
			expect(result.data.limit).toBe(20);
		}
	});
});
