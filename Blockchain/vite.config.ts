import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8082,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add Node.js polyfills
  define: {
    global: {},
  },
  // Provide polyfills for Node.js built-in modules
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure base path is set correctly for deployment
    base: '/',
  },
}));
