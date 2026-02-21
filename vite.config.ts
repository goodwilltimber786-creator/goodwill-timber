import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    middlewareMode: false,
    // Fallback to index.html for SPA routing
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: "/index.html",
        },
      ],
    },
  },
  plugins: [
    react(),
    {
      name: 'copy-sitemap',
      apply: 'build',
      enforce: 'post',
      generateBundle() {
        // Copy sitemap.xml from dist to root output directory
        const sitemapPath = path.join(__dirname, 'dist/sitemap.xml');
        if (fs.existsSync(sitemapPath)) {
          const content = fs.readFileSync(sitemapPath, 'utf-8');
          this.emitFile({
            type: 'asset',
            fileName: 'sitemap.xml',
            source: content,
          });
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
