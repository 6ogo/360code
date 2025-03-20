const express = require('express');
const { createServer: createViteServer } = require('vite');
const fs = require('fs');
const path = require('path');

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve static files
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Handle all routes for SPA
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  });

  app.listen(8080, () => {
    console.log('Server running at http://localhost:8080');
  });
}

createServer();
