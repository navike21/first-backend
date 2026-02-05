/**
 * @copyright Copyright navike21
 * @license Apache-2.0
 */

import { configureApp } from '@Config/app';
import { handleServerShutdown, startServer } from '@Config/mainServer';

configureApp();
startServer();

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);
