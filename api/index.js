// Vercel serverless function wrapper
// CommonJS require since dist/ is compiled to CommonJS
const { default: app, readyPromise } = require('../dist/index');

async function handler(req, res) {
	console.log('[vercel] handler called, url:', req.url, 'VERCEL:', process.env.VERCEL);
	try {
		await readyPromise;
		console.log('[vercel] ready. stack:', app._router ? app._router.stack.length : 'no router');
	} catch (err) {
		console.error('[vercel] init failed:', err.message);
		res.status(503).json({ error: 'Service initializing, try again' });
		return;
	}
	app(req, res);
}

module.exports = handler;
