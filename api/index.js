// Vercel serverless function wrapper
// CommonJS require since dist/ is compiled to CommonJS
const { default: app, appReady, ensureConnected } = require('../dist/index');

module.exports = async function handler(req, res) {
	// Wait for i18n + routes setup. This promise resolves on first call and
	// is cached — it never rejects because it does not touch the database.
	await appReady;

	// Attempt DB connection. connectToDatabase() is idempotent (no-op when
	// already connected) so retries on subsequent requests are safe.
	try {
		await ensureConnected();
	} catch (err) {
		console.error('[Vercel] DB connection failed:', err?.message ?? err);
		return res.status(503).json({
			success: false,
			code: 'SERVICE_UNAVAILABLE',
			message: 'Service temporarily unavailable. Please try again later.',
		});
	}

	return app(req, res);
};
