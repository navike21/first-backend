import dns from 'node:dns';
import express from 'express';
import { initApp, connectToDatabase } from '@Config/mainServer';

// Required for MongoDB Atlas SRV lookup — Node's c-ares resolver may not reach
// IPv6 link-local DNS (fe80::x) on some environments (Windows dev, Vercel Linux).
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

// Fast setup: i18n + routes. Never touches the DB so it never rejects.
export const appReady = initApp(app);

// Re-exported so api/index.js can call it independently and retry on failure.
export { connectToDatabase as ensureConnected };

export default app;
