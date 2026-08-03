import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { handleChatMessage } from './controllers/chatController.js';
import { notificationService } from './services/notificationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ============================================================
// API ROUTES
// ============================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MindMentor Node Express Backend',
    environment: process.env.VERCEL ? 'vercel' : 'local',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/chat', handleChatMessage);

app.get('/api/notifications', (req, res) => {
  res.json({
    status: 'success',
    notifications: notificationService.getRecent()
  });
});

app.post('/api/notifications/complete-habit', (req, res) => {
  const { title, philosophy } = req.body || {};

  if (title) {
    notificationService.dispatchHabitCompletion(title, philosophy);
  }

  res.json({
    status: 'success',
    message: 'Habit completion recorded'
  });
});

app.post('/api/notifications/trigger-insight', (req, res) => {
  const { title, message, philosophy } = req.body || {};

  notificationService.dispatchInsight(
    title || 'Philosophical Reflection',
    message || 'Reflect on what is within your power today.',
    philosophy || 'Stoicism'
  );

  res.json({
    status: 'success',
    message: 'Insight event emitted'
  });
});

// ============================================================
// FRONTEND
// ============================================================

if (process.env.VERCEL) {
  // Vercel runs this Express application as a serverless function.
  // The Vite build creates the dist directory during deployment.
  const distPath = path.join(process.cwd(), 'dist');

  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }

    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Local development
  const startLocalServer = async () => {
    const vite = await createViteServer({
      server: {
        middlewareMode: true
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  };

  await startLocalServer();
}

// ============================================================
// LOCAL SERVER
// ============================================================

// IMPORTANT:
// Vercel needs the Express app exported.
// Locally we still use app.listen().

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[MindMentor] Express server listening on http://localhost:${PORT}`
    );
  });
}

export default app;