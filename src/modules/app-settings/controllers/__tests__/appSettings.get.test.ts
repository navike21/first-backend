import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

const { mockGetAppSettings, mockSuccessResponse } = vi.hoisted(() => ({
	mockGetAppSettings: vi.fn(),
	mockSuccessResponse: vi.fn(),
}));

vi.mock('@Modules/app-settings/application/getAppSettings', () => ({
	getAppSettings: mockGetAppSettings,
}));

vi.mock('@Helpers/responseStructure', () => ({
	successResponse: mockSuccessResponse,
}));

import { appSettingsGetController } from '../appSettings.get';

function run(): Promise<void> {
	return new Promise((resolve, reject) => {
		mockSuccessResponse.mockReset();
		mockSuccessResponse.mockImplementationOnce(() => resolve());
		const next: NextFunction = (err?: unknown) => (err ? reject(err) : resolve());
		appSettingsGetController({} as Request, {} as Response, next);
	});
}

describe('appSettingsGetController', () => {
	beforeEach(() => vi.clearAllMocks());

	it('calls getAppSettings and returns 200 with settings data', async () => {
		const settings = { general: { appName: 'App' } };
		mockGetAppSettings.mockResolvedValue(settings);

		await run();

		expect(mockGetAppSettings).toHaveBeenCalledOnce();
		expect(mockSuccessResponse).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				statusCode: 200,
				message: 'SUCCESS_APP_SETTINGS_FOUND',
				ns: 'app-settings',
				data: settings,
			}),
		);
	});

	it('passes error to next when getAppSettings rejects', async () => {
		mockGetAppSettings.mockRejectedValue(new Error('db error'));
		await expect(run()).rejects.toThrow('db error');
	});
});
