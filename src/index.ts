import dns from 'node:dns';
import express from 'express';
import { initApp } from '@Config/mainServer';
import { ENV } from '@Constants/environments';

// Required for MongoDB Atlas SRV lookup — Node's c-ares resolver may not reach
// IPv6 link-local DNS (fe80::x) on some environments (Windows dev, Vercel Linux).
dns.setServers(ENV.DNS_SERVERS.split(','));

const app = express();

// Fast setup: i18n + routes. Never touches the DB so it should not reject.
export const appReady = initApp(app);

// Re-exported so api/index.js can call it independently and retry on failure.

export default app;

export { connectToDatabase as ensureConnected } from '@Config/mainServer';
