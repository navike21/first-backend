import { describe, it, expect } from 'vitest';
import {
	CreateCollaboratorSchema,
	UpdateCollaboratorSchema,
	ListCollaboratorQuerySchema,
} from '@Modules/collaborators/schemas/collaborator.schema';

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
	role: 'developer',
	bio: localizedName,
};

describe('team.schema', () => {
	it('CreateCollaboratorSchema parses valid minimal data', () => {
		const result = CreateCollaboratorSchema.safeParse(validMember);
		expect(result.success).toBe(true);
	});

	it('CreateCollaboratorSchema rejects missing name', () => {
		const result = CreateCollaboratorSchema.safeParse({
			role: localizedName,
			bio: localizedName,
		});
		expect(result.success).toBe(false);
	});

	it('CreateCollaboratorSchema rejects missing role', () => {
		const result = CreateCollaboratorSchema.safeParse({
			name: 'Jane',
			bio: localizedName,
		});
		expect(result.success).toBe(false);
	});

	it('CreateCollaboratorSchema rejects an empty role', () => {
		const result = CreateCollaboratorSchema.safeParse({
			name: 'Jane',
			role: '',
			bio: localizedName,
		});
		expect(result.success).toBe(false);
	});

	it('CreateCollaboratorSchema accepts an optional level', () => {
		const result = CreateCollaboratorSchema.safeParse({
			...validMember,
			level: 'senior',
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.level).toBe('senior');
	});

	it('CreateCollaboratorSchema rejects incomplete localizedString in bio', () => {
		const result = CreateCollaboratorSchema.safeParse({
			name: 'Jane',
			role: 'developer',
			bio: { en: 'Developer' },
		});
		expect(result.success).toBe(false);
	});

	it('CreateCollaboratorSchema defaults order to 0 and isActive to true', () => {
		const result = CreateCollaboratorSchema.safeParse(validMember);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.order).toBe(0);
			expect(result.data.isActive).toBe(true);
		}
	});

	it('CreateCollaboratorSchema accepts optional socialLinks', () => {
		const result = CreateCollaboratorSchema.safeParse({
			...validMember,
			socialLinks: {
				linkedin: 'https://linkedin.com/in/jane',
				github: 'https://github.com/jane',
			},
		});
		expect(result.success).toBe(true);
	});

	it('CreateCollaboratorSchema rejects invalid URL in socialLinks', () => {
		const result = CreateCollaboratorSchema.safeParse({
			...validMember,
			socialLinks: { linkedin: 'not-a-url' },
		});
		expect(result.success).toBe(false);
	});

	it('CreateCollaboratorSchema coerces order string to number', () => {
		const result = CreateCollaboratorSchema.safeParse({
			...validMember,
			order: '3',
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.order).toBe(3);
	});

	it('UpdateCollaboratorSchema allows partial data', () => {
		const result = UpdateCollaboratorSchema.safeParse({ name: 'John' });
		expect(result.success).toBe(true);
	});

	it('UpdateCollaboratorSchema allows empty object', () => {
		const result = UpdateCollaboratorSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it('ListCollaboratorQuerySchema defaults page and limit', () => {
		const result = ListCollaboratorQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});

	it('ListCollaboratorQuerySchema coerces string to number', () => {
		const result = ListCollaboratorQuerySchema.safeParse({
			page: '2',
			limit: '20',
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(2);
			expect(result.data.limit).toBe(20);
		}
	});
});
