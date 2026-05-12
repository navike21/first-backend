import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Modules/team/application/createTeamMember', () => ({
	createTeamMember: vi.fn(),
}));

import { teamCreateController } from '@Modules/team/controllers/team.create';
import { createTeamMember } from '@Modules/team/application/createTeamMember';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

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

const validBody = {
	name: 'Jane Doe',
	role: localizedName,
	bio: localizedName,
};

describe('teamCreateController', () => {
	it('calls createTeamMember and returns 201 on valid input', async () => {
		vi.mocked(createTeamMember).mockResolvedValue({
			id: '1',
			name: 'Jane Doe',
		} as never);
		const req = { body: validBody } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await teamCreateController(req, res, next);

		expect(createTeamMember).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await teamCreateController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
