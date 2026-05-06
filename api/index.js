// Vercel serverless function wrapper
// CommonJS require since dist/ is compiled to CommonJS
const { default: app, readyPromise } = require('../dist/index');

async function handler(req, res) {
	await readyPromise;
	app(req, res);
}

module.exports = handler;
