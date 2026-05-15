import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/team/infrastructure/TeamMemberModel', () => ({
	default: { create: vi.fn() },
}));

import { createTeamMember } from '@Modules/team/application/createTeamMember';
import TeamMemberModel from '@Modules/team/infrastructure/TeamMemberModel';

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

const validInput = {
	name: 'Jane Doe',
	role: localizedName,
	bio: localizedName,
	order: 0,
	isActive: true,
};

describe('createTeamMember', () => {
	it('creates a team member and returns cleaned data', async () => {
		vi.mocked(TeamMemberModel.create).mockResolvedValue({
			...validInput,
			id: '550e8400-e29b-41d4-a716-446655440000',
			toObject: vi.fn().mockReturnValue({
				...validInput,
				id: '550e8400-e29b-41d4-a716-446655440000',
				_id: 'mongo-1',
			}),
		} as never);

		const result = await createTeamMember(validInput);

		expect(TeamMemberModel.create).toHaveBeenCalledWith(validInput);
		expect(result).not.toHaveProperty('_id');
		expect(result.name).toBe('Jane Doe');
	});
});
