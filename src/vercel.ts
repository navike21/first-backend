// Register tsconfig-paths for module resolution
import * as tsConfigPaths from 'tsconfig-paths';
import * as path from 'node:path';

const baseUrl = path.join(__dirname, '..');
const tsconfig = require(path.join(baseUrl, 'tsconfig.json'));

tsConfigPaths.register({
	baseUrl,
	paths: tsconfig.compilerOptions.paths,
});

// Now import and export the app
export { default } from './server';
