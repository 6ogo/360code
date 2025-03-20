import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/', // Explicitly set base to root
  appType: 'spa', // Explicitly mark as SPA
  
  server: {
    host: "::",
    port: 8080,
    // Ensure proper SPA routing
    strictPort: true,
    open: true, 
    cors: true,
    // Add historyApiFallback to handle client-side routing
    historyApiFallback: true,
  },
  
  preview: {
    port: 8080,
    // Forward all 404s to index.html for SPA routing
    strictPort: true,
    host: "::",
  },
  
  plugins: [
    react(),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Add proper build configuration for SPA
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate SPA index.html file for client-side routing
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}));
