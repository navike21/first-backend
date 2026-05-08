// Vercel serverless function wrapper
// CommonJS require since dist/ is compiled to CommonJS
const { default: app, appReady, ensureConnected } = require('../dist/index');

// Attach a rejection handler at module-load time so that if initApp() ever
// rejects, Node does NOT terminate the process with "unhandled rejection"
// before the first request arrives. The error is surfaced per-request below.
let appInitError = null;
const safeAppReady = appReady.catch((err) => {
	console.error('[Vercel] App setup failed:', err?.message ?? err);
	appInitError = err;
});

module.exports = async function handler(req, res) {
	// Wait for setup (always resolves — errors captured in appInitError).
	await safeAppReady;

	if (appInitError) {
		console.error('[Vercel] Serving 503 due to setup failure:', appInitError?.message);
		return res.status(503).json({
			success: false,
			code: 'SERVICE_UNAVAILABLE',
			message: 'Service temporarily unavailable. Please try again later.',
		});
	}

	// Attempt DB connection — idempotent (no-op when already connected), retried
	// on each request until it succeeds.
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
