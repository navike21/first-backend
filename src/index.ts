import dns from 'node:dns';
import { handleServerShutdown, startServer } from '@Config/mainServer';
import express from 'express';

// Node.js c-ares no resuelve servidores DNS IPv6 link-local (fe80::x) en Windows.
// Necesario para que el SRV lookup de MongoDB Atlas funcione correctamente.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

startServer(app);

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);

// Export for Vercel serverless
export default app;
