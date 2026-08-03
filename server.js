import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { createServer as createViteServer } from 'vite';
import { handleChatMessage } from './controllers/chatController.js';
import { notificationService } from './services/notificationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Attempt to spawn Python microservice in background if python is available
  try {
    const pythonProc = spawn('python3', ['main.py'], {
      stdio: 'inherit',
      env: { ...process.env, PYTHON_PORT: '8000' }
    });

    pythonProc.on('error', (err) => {
      console.log('[Express Server] Python process spawn attempt notice (will use Node Gemini Orchestrator):', err.message);
    });

    process.on('exit', () => {
      try { pythonProc.kill(); } catch (e) {}
    });
  } catch (err) {
    console.log('[Express Server] Could not launch python process directly:', err.message);
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'MindMentor Node Express Backend',
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
    res.json({ status: 'success', message: 'Habit completion recorded' });
  });

  app.post('/api/notifications/trigger-insight', (req, res) => {
    const { title, message, philosophy } = req.body || {};
    notificationService.dispatchInsight(
      title || 'Philosophical Reflection',
      message || 'Reflect on what is within your power today.',
      philosophy || 'Stoicism'
    );
    res.json({ status: 'success', message: 'Insight event emitted' });
  });

  // Vite development middleware or static asset serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MindMentor] Express server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
