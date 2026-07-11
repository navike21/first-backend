import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import PageModel from '@Modules/pages/infrastructure/PageModel';

describe('PageModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(PageModel).toBeDefined();
		expect(typeof PageModel.find).toBe('function');
		expect(typeof PageModel.findOne).toBe('function');
		expect(typeof PageModel.create).toBe('function');
	});

	// No live DB needed: Mongoose casts values into the schema on
	// construction itself. This is the exact bug class from earlier this
	// session (a sub-schema silently stripping fields Zod already validated) —
	// verify every declared field actually survives casting, not just that
	// the schema *compiles*.
	describe('settings.background casting (no field silently dropped)', () => {
		it('keeps every field of an image background', () => {
			const doc = new PageModel({
				title: { en: 'Test' },
				sections: [
					{
						type: 'columns',
						settings: {
							background: {
								desktop: { type: 'image', url: 'https://cdn/bg.jpg', position: 'top', fullScreen: true, parallax: true },
							},
						},
					},
				],
			});

			// toMatchObject (not toEqual): the flat Mongoose sub-schema also
			// carries default-populated sibling-variant fields (e.g. `files: []`
			// from the video variant) alongside an image config — harmless, Zod
			// on the way back in only reads the fields its 'image' branch cares
			// about. What matters here is that nothing WE SPECIFIED got dropped.
			const background = doc.toObject().sections[0].settings.background.desktop;
			expect(background).toMatchObject({
				type: 'image',
				url: 'https://cdn/bg.jpg',
				position: 'top',
				fullScreen: true,
				parallax: true,
			});
		});

		it('keeps every field of an uploaded video background with two format files', () => {
			const doc = new PageModel({
				title: { en: 'Test' },
				sections: [
					{
						type: 'columns',
						settings: {
							background: {
								desktop: {
									type: 'video',
									sourceKind: 'upload',
									files: [
										{ url: 'https://blob/x.mp4', mimeType: 'video/mp4' },
										{ url: 'https://blob/x.webm', mimeType: 'video/webm' },
									],
									parallax: false,
								},
							},
						},
					},
				],
			});

			const background = doc.toObject().sections[0].settings.background.desktop;
			expect(background.type).toBe('video');
			expect(background.sourceKind).toBe('upload');
			expect(background.files).toEqual([
				{ url: 'https://blob/x.mp4', mimeType: 'video/mp4' },
				{ url: 'https://blob/x.webm', mimeType: 'video/webm' },
			]);
			expect(background.parallax).toBe(false);
		});

		it('keeps embedUrl for an embed-sourced video, independent per breakpoint', () => {
			const doc = new PageModel({
				title: { en: 'Test' },
				sections: [
					{
						type: 'columns',
						settings: {
							background: {
								desktop: { type: 'image', url: 'https://cdn/desktop.jpg' },
								tablet: { type: 'none' },
								mobile: { type: 'video', sourceKind: 'embed', embedUrl: 'https://vimeo.com/1' },
							},
						},
					},
				],
			});

			const { desktop, tablet, mobile } = doc.toObject().sections[0].settings.background;
			expect(desktop.url).toBe('https://cdn/desktop.jpg');
			expect(tablet.type).toBe('none');
			expect(mobile.embedUrl).toBe('https://vimeo.com/1');
		});
	});
});
