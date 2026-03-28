// Vercel serverless function wrapper
// CommonJS require since dist/ is compiled to CommonJS
const app = require('../dist/index').default;

// Vercel automatically wraps Express apps
module.exports = app;
