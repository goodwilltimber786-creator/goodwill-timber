#!/usr/bin/env node

/**
 * Sitemap Generator for Goodwill Timbers
 * This script generates a comprehensive sitemap.xml with all products and categories from database
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Define all static routes
const staticRoutes = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/categories', priority: '0.9', changefreq: 'daily' },
  { loc: '/products', priority: '0.9', changefreq: 'daily' },
  { loc: '/about', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.8', changefreq: 'weekly' },
  { loc: '/my-orders', priority: '0.6', changefreq: 'weekly' },
];

// Sample/fallback product categories
const sampleCategories = [
  { id: 'timber', name: 'Timber', slug: 'timber', priority: '0.85', changefreq: 'weekly' },
  { id: 'plywood', name: 'Plywood', slug: 'plywood', priority: '0.85', changefreq: 'weekly' },
  { id: 'doors', name: 'Doors', slug: 'doors', priority: '0.85', changefreq: 'weekly' },
  { id: 'hardware', name: 'Hardware', slug: 'hardware', priority: '0.9', changefreq: 'daily' },
  { id: 'fittings', name: 'Fittings', slug: 'fittings', priority: '0.85', changefreq: 'weekly' },
  { id: 'bulk', name: 'Bulk Orders', slug: 'bulk', priority: '0.8', changefreq: 'weekly' },
];

// Sample/fallback products
const sampleProducts = [
  // Hardware products
  { id: 'hw-001', name: 'Door Handles - Stainless Steel', category: 'hardware', priority: '0.8' },
  { id: 'hw-002', name: 'Door Hinges - Heavy Duty', category: 'hardware', priority: '0.8' },
  { id: 'hw-003', name: 'Locks - Mortise Locks', category: 'hardware', priority: '0.8' },
  { id: 'hw-004', name: 'Bolts & Latches', category: 'hardware', priority: '0.8' },
  { id: 'hw-005', name: 'Cabinet Handles', category: 'hardware', priority: '0.75' },
  
  // Timber products
  { id: 'tm-001', name: 'Teak Wood - Premium Grade', category: 'timber', priority: '0.8' },
  { id: 'tm-002', name: 'Sal Wood - Construction Grade', category: 'timber', priority: '0.8' },
  { id: 'tm-003', name: 'Pine Wood - Budget Friendly', category: 'timber', priority: '0.75' },
  
  // Plywood products
  { id: 'ply-001', name: 'BWP Grade Plywood', category: 'plywood', priority: '0.8' },
  { id: 'ply-002', name: 'MR Grade Plywood', category: 'plywood', priority: '0.8' },
  { id: 'ply-003', name: 'Decorative Plywood', category: 'plywood', priority: '0.75' },
  
  // Door products
  { id: 'dr-001', name: 'Flush Doors - Wooden', category: 'doors', priority: '0.8' },
  { id: 'dr-002', name: 'Panel Doors', category: 'doors', priority: '0.8' },
  
  // Fittings
  { id: 'ft-001', name: 'Hinges & Brackets', category: 'fittings', priority: '0.8' },
  { id: 'ft-002', name: 'Door Closers', category: 'fittings', priority: '0.8' },
];

// Fetch data from Supabase
const fetchFromSupabase = async () => {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠ Supabase credentials not found. Using sample data.');
      return { products: sampleProducts, categories: sampleCategories };
    }

    console.log('📡 Fetching products from Supabase...');

    // Fetch categories
    const categoriesResponse = await fetch(
      `${supabaseUrl}/rest/v1/categories?select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    // Fetch products
    const productsResponse = await fetch(
      `${supabaseUrl}/rest/v1/products?select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    let categories = sampleCategories;
    let products = sampleProducts;

    if (categoriesResponse.ok) {
      const fetchedCategories = await categoriesResponse.json();
      if (fetchedCategories && fetchedCategories.length > 0) {
        categories = fetchedCategories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          priority: '0.85',
          changefreq: 'weekly',
        }));
        console.log(`✓ Fetched ${categories.length} categories from database`);
      }
    }

    if (productsResponse.ok) {
      const fetchedProducts = await productsResponse.json();
      if (fetchedProducts && fetchedProducts.length > 0) {
        products = fetchedProducts.map((prod) => ({
          id: prod.id,
          name: prod.name,
          category: prod.category_id,
          priority: '0.8',
        }));
        console.log(`✓ Fetched ${products.length} products from database`);
      }
    }

    return { products, categories };
  } catch (error) {
    console.warn('⚠ Error fetching from Supabase, using sample data:', error.message);
    return { products: sampleProducts, categories: sampleCategories };
  }
};

// Generate sitemap XML
const generateSitemap = (products, categories) => {
  const currentDate = getCurrentDate();
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  // Add static routes
  staticRoutes.forEach((route) => {
    xml += '  <url>\n';
    xml += `    <loc>https://goodwilltimbers.com${route.loc}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  // Add category routes
  categories.forEach((category) => {
    xml += '  <url>\n';
    xml += `    <loc>https://goodwilltimbers.com/categories/${category.id || category.slug}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${category.changefreq || 'weekly'}</changefreq>\n`;
    xml += `    <priority>${category.priority || '0.8'}</priority>\n`;
    xml += '  </url>\n';
  });

  // Add product routes
  products.forEach((product) => {
    xml += '  <url>\n';
    xml += `    <loc>https://goodwilltimbers.com/products/${product.id}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += `    <priority>${product.priority || '0.8'}</priority>\n`;
    
    // Add product title and description for SEO
    xml += `    <title>${product.name} - Product Variants</title>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return xml;
};

// Main function
const main = async () => {
  const { products, categories } = await fetchFromSupabase();
  
  // Create dist directory if it doesn't exist (for production)
  const distPath = path.join(__dirname, '../dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }
  
  // Write to both locations for development and production
  const publicPath = path.join(__dirname, '../public/sitemap.xml');
  const distSitemapPath = path.join(__dirname, '../dist/sitemap.xml');
  
  const sitemap = generateSitemap(products, categories);

  fs.writeFileSync(publicPath, sitemap, 'utf-8');
  fs.writeFileSync(distSitemapPath, sitemap, 'utf-8');
  
  console.log('\n✓ Sitemap generated successfully!');
  console.log(`📍 Locations:`);
  console.log(`   - Development: ${publicPath}`);
  console.log(`   - Production: ${distSitemapPath}`);
  console.log(`📊 Statistics:`);
  console.log(`   - Static routes: ${staticRoutes.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Total URLs: ${staticRoutes.length + categories.length + products.length}`);
  console.log(`\n✓ Hardware-focused products indexed for SEO`);
};

// Run
main().catch((error) => {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
});
