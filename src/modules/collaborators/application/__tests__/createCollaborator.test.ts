import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/collaborators/infrastructure/CollaboratorModel', () => ({
	default: { create: vi.fn() },
}));

import { createCollaborator } from '@Modules/collaborators/application/createCollaborator';
import CollaboratorModel from '@Modules/collaborators/infrastructure/CollaboratorModel';

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
	role: 'developer',
	bio: localizedName,
	order: 0,
	isActive: true,
};

describe('createCollaborator', () => {
	it('creates a team member and returns cleaned data', async () => {
		vi.mocked(CollaboratorModel.create).mockResolvedValue({
			...validInput,
			id: '550e8400-e29b-41d4-a716-446655440000',
			toObject: vi.fn().mockReturnValue({
				...validInput,
				id: '550e8400-e29b-41d4-a716-446655440000',
				_id: 'mongo-1',
			}),
		} as never);

		const result = await createCollaborator(validInput);

		expect(CollaboratorModel.create).toHaveBeenCalledWith(
			expect.objectContaining(validInput),
		);
		expect(result.data).not.toHaveProperty('_id');
		expect(result.data.name).toBe('Jane Doe');
		expect(result.warnings).toEqual([]);
	});
});
