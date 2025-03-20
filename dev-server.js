import express from 'express';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import history from 'connect-history-api-fallback';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();
  
  // Apply history API fallback middleware
  app.use(history({ 
    verbose: true,
    disableDotRule: true
  }));

  // Create Vite server in middleware mode
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  // Start server
  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`Development server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
});
