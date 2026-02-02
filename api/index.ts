import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    message: 'FIRST Backend is running!',
    node: process.version,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((_, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.info(`🚀 Server running on http://localhost:${PORT}`);
});
