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
      name: 'copy-public-files',
      apply: 'build',
      enforce: 'post',
      closeBundle: async () => {
        // Copy sitemap.xml and robots.txt from public to dist
        const filesToCopy = ['sitemap.xml', 'robots.txt'];
        const distDir = path.join(__dirname, 'dist');
        const publicDir = path.join(__dirname, 'public');

        // Ensure dist directory exists
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }

        filesToCopy.forEach((file) => {
          const src = path.join(publicDir, file);
          const dest = path.join(distDir, file);
          
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`✓ Copied ${file} to dist/`);
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
