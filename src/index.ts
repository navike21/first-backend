import dns from 'node:dns';
import express from 'express';
import { initializeApp } from '@Config/mainServer';

// Node.js c-ares no resuelve servidores DNS IPv6 link-local (fe80::x) en Windows.
// Necesario para que el SRV lookup de MongoDB Atlas funcione correctamente.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

export const readyPromise = initializeApp(app);

export default app;
