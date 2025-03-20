import express from 'express';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import history from 'connect-history-api-fallback';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createDevServer() {
  const app = express();

  // Use history API fallback for SPA routing
  app.use(history({
    verbose: true,
    disableDotRule: true
  }));

  // Create Vite server in middleware mode
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve static files from the public directory
  app.use(express.static(resolve(__dirname, 'public')));

  // Handle all routes for SPA
  app.use('*', (req, res, next) => {
    // For any path not explicitly handled before, send index.html
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(resolve(__dirname, 'index.html'));
  });

  app.listen(8080, () => {
    console.log('🚀 Development server running at http://localhost:8080');
    console.log('🔄 Press Ctrl+C to stop');
  });
}

createDevServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
