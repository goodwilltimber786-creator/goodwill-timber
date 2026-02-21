# 🌳 Timber Strong - Complete Setup Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Supabase Setup](#supabase-setup)
5. [Telegram Bot Setup](#telegram-bot-setup)
6. [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
8. [Admin Panel Access](#admin-panel-access)
9. [How to Use](#how-to-use)
10. [Troubleshooting](#troubleshooting)
11. [Deployment](#deployment)

---

## Project Overview

**Timber Strong** is a complete e-commerce solution for selling timber and building materials with:

- ✅ **Dynamic Product Management** - Manage products and categories from an admin panel
- ✅ **Admin Dashboard** - View statistics and manage submissions
- ✅ **Multiple Checkout Options** - Form, WhatsApp, Email, Phone
- ✅ **Telegram Notifications** - Get instant alerts for every order
- ✅ **Supabase Backend** - Secure database in the cloud
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Real-time Updates** - Changes appear instantly

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **UI Framework:** Shadcn UI + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Notifications:** Telegram Bot API
- **State Management:** React Query (TanStack Query)
- **Routing:** React Router v6

---

## Prerequisites

### What You Need:
1. **Node.js** (version 16+)
2. **npm** or **bun** package manager
3. **Git** (optional, for version control)
4. **Supabase Account** (free tier available)
5. **Telegram Account** (for notifications)

### Check Your System:
```bash
# Check Node.js version
node --version
# Output should be v16 or higher

# Check npm version
npm --version
# Output should be v7 or higher
```

### Install Node.js:
If not installed, download from: https://nodejs.org/

---

## Installation

### Step 1: Clone or Download the Project

**Option A: Using Git (if installed)**
```bash
git clone <repository-url>
cd timber-strong-main
```

**Option B: Download ZIP**
1. Download the project as ZIP
2. Extract to your desired location
3. Open terminal/command prompt in the extracted folder

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# OR using bun (if you prefer)
bun install
```

This will download and install all required packages (~500MB).

**Expected output:**
```
added 1234 packages in 45s
```

### Step 3: Create Environment File

```bash
# Copy the example environment file
cp .env.example .env.local

# Or on Windows (PowerShell):
Copy-Item .env.example .env.local
```

You now have `.env.local` - we'll fill this with your credentials next.

---

## Supabase Setup

### Step 1: Create Supabase Account

1. Go to https://supabase.com/
2. Click "Start your project"
3. Sign up with Google, GitHub, or email
4. Create a new organization
5. Create a new project:
   - **Name:** timber-strong (or your preference)
   - **Database Password:** Create a strong password
   - **Region:** Choose closest to your location
   - Click "Create new project"

**Wait 2-3 minutes for project to initialize**

### Step 2: Get Your Supabase Credentials

1. Once project is ready, go to **Settings > API**
2. Copy these values:
   - **Project URL** - `https://xxxx.supabase.co`
   - **Anon Key** - Long string starting with `eyJ...`

### Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire content of `supabase_schema.sql` (in project root)
4. Click **Run**

**Expected result:** "Success" message

### Step 4: Verify Tables Created

1. Go to **Table Editor** in Supabase
2. You should see 3 tables:
   - `categories`
   - `products`
   - `contact_submissions`

### Step 5: Add Sample Data (Optional)

In Supabase **SQL Editor**, run:

```sql
-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
('Timber', 'Premium timber and hardwood materials', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),
('Plywood', 'Commercial and marine grade plywood', 'https://images.unsplash.com/photo-1564629238246-6a9f9c4a8e47?w=500'),
('Doors', 'Wooden doors and frames', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500'),
('Hardware', 'Door handles and fixtures', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500');

-- Insert sample products (copy category id from your database)
INSERT INTO products (name, description, price, category_id, image_url, has_buy_now, has_contact_us) VALUES
('Premium Teak Wood', 'Grade A teak wood planks, kiln-dried', 5000, (SELECT id FROM categories WHERE name='Timber' LIMIT 1), 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', true, true),
('Marine Plywood', 'Waterproof marine grade plywood', 3500, (SELECT id FROM categories WHERE name='Plywood' LIMIT 1), 'https://images.unsplash.com/photo-1564629238246-6a9f9c4a8e47?w=500', true, true),
('Panel Door', 'Premium wooden panel door', 8000, (SELECT id FROM categories WHERE name='Doors' LIMIT 1), 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500', true, true);
```

---

## Telegram Bot Setup

### Step 1: Create Telegram Bot

1. Open Telegram app or go to https://web.telegram.org/
2. Search for **@BotFather**
3. Send: `/newbot`
4. Follow prompts:
   - Give your bot a name: `Timber Strong Orders`
   - Give your bot a username: `timber_strong_bot` (must be unique)
5. **Copy the token** provided (e.g., `123456:ABC-DEF1234...`)

### Step 2: Get Your Chat ID

1. Search for your bot in Telegram
2. Click Start or send any message
3. Open browser and visit:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
   Replace `<YOUR_BOT_TOKEN>` with the token from Step 1

4. Look for the response and find:
   ```json
   "chat":{"id":123456789}
   ```
   Your **Chat ID** is the number

### Step 3: Verify Bot Works

Send a test message to your bot - it should register in the `getUpdates` response.

---

## Environment Configuration

### Edit .env.local File

Open `.env.local` in your text editor and fill in your credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Telegram Configuration
VITE_TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
VITE_TELEGRAM_CHAT_ID=987654321

# Admin Configuration
VITE_ADMIN_PASSWORD=your_secure_password_123
```

### Example with Real Values:

```env
VITE_SUPABASE_URL=https://iamxyezpqrtfghij.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhbXh5ZXpwcXJ0ZmdoaWoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjMyNTAwMCwiZXhwIjoxNjMyNDExNDAwfQ.abcdefghijklmnopqrstuvwxyz123456789

VITE_TELEGRAM_BOT_TOKEN=5890123456:AAGP_1r-QZXz1r-QZXz1r-QZXz1r-QZXz1r
VITE_TELEGRAM_CHAT_ID=123456789

VITE_ADMIN_PASSWORD=MySecureAdmin@2024
```

### Find Your Values:

**Supabase URL:** Settings > API > URL
**Supabase Key:** Settings > API > Anon public
**Telegram Token:** From @BotFather
**Chat ID:** From getUpdates API
**Admin Password:** Create your own (strong password recommended)

---

## Running the Application

### Development Mode

```bash
# Start development server
npm run dev

# Output:
# ✓ built in 3.45s
# VITE v7.3.1  running at:
#
#   ➜  Local:   http://localhost:5173/
#   ➜  press h to show help
```

### Access the Application

1. Open browser
2. Go to: http://localhost:5173/
3. Homepage should load with your products

### Stop the Server

Press `Ctrl + C` in terminal

---

## Admin Panel Access

### Login to Admin Panel

1. **Open Admin Login Page:**
   - Go to: http://localhost:5173/admin/login
   - Or click "Admin Login" link (if added to navbar)

2. **Enter Admin Password:**
   - Password: Whatever you set in `VITE_ADMIN_PASSWORD`
   - Example: `MySecureAdmin@2024`

3. **Click Login Button**

4. **You should see the Admin Dashboard**

### Admin Dashboard Overview

**URL:** http://localhost:5173/admin

Main sections:
- **Dashboard** - View statistics and recent orders
- **Categories** - Manage product categories
- **Products** - Manage individual products
- **Submissions** - View customer orders and inquiries

---

## How to Use

### For Admins: Managing Products

#### Add a Category

1. Go to http://localhost:5173/admin/categories
2. Click **"Add Category"** button
3. Fill in the form:
   - **Category Name:** e.g., "Timber"
   - **Description:** e.g., "Premium timber and hardwood"
   - **Image URL:** Paste a category image URL
4. Click **"Create"**
5. New category appears on homepage!

#### Add a Product

1. Go to http://localhost:5173/admin/products
2. Click **"Add Product"** button
3. Fill in the form:
   - **Product Name:** e.g., "Premium Teak Wood"
   - **Category:** Select from dropdown
   - **Price:** e.g., 5000
   - **Description:** Product details
   - **Image URL:** Product image URL
   - **Enable "Buy Now":** Toggle ON/OFF
   - **Enable "Contact Us":** Toggle ON/OFF
4. Click **"Create"**
5. Product appears on products page!

#### Edit a Product

1. In Products table, click **Edit icon** (pencil)
2. Modify the details
3. Click **"Update"**
4. Changes appear immediately!

#### Delete a Product

1. In Products table, click **Delete icon** (trash)
2. Product is removed
3. No longer appears on frontend

### For Customers: Ordering

#### Browse Products

1. Go to Homepage or /products
2. See categories and products from database
3. Click category to filter products

#### Place an Order (3 Options)

**Option 1: Order Form**
- Click **"Buy Now"** button
- Select **"Order Form"** tab
- Fill in your details
- Click **"Place Order"**
- Order saved to database
- Telegram notification sent to admin

**Option 2: WhatsApp Chat**
- Click **"Buy Now"** button
- Select **"WhatsApp"** tab
- Click **"Open WhatsApp Chat"**
- Direct WhatsApp conversation
- No form needed

**Option 3: Direct Contact**
- Click **"Buy Now"** button
- Select **"Direct Contact"** tab
- Choose: Email, Call, or WhatsApp
- Direct links to your contact info

#### Send an Inquiry

1. Click **"Inquiry"** button on product
2. Fill in inquiry form
3. Click **"Send Message"**
4. Inquiry saved to database
5. Telegram notification sent to admin

### For Admins: Managing Orders

#### View All Orders

1. Go to http://localhost:5173/admin/submissions
2. See all customer orders and inquiries
3. Sorted by newest first

#### View Order Details

1. Click **Eye icon** on any submission
2. See full customer details and message
3. Can also click email/phone to contact

#### Receive Telegram Notifications

- Every order sends Telegram message
- Message includes:
  - Customer name, email, phone
  - Product name and price
  - Customer message
  - Timestamp

#### Respond to Customer

From Telegram message or admin panel:
- Click email to send email reply
- Click phone to call customer
- Click WhatsApp to message on WhatsApp

---

## Troubleshooting

### Products Not Showing?

**Issue:** Homepage shows empty product section

**Solutions:**
1. Check if you added products in admin panel
2. Verify Supabase credentials in `.env.local`
3. Check if products have valid category_id
4. Refresh browser (Ctrl+F5)
5. Check browser console for errors (F12)

### Can't Login to Admin Panel?

**Issue:** "Invalid password" error

**Solutions:**
1. Check if you set `VITE_ADMIN_PASSWORD` in `.env.local`
2. Verify you typed password correctly (case-sensitive)
3. Clear browser cache: Ctrl+Shift+Delete
4. Try in incognito window
5. Reload page: F5

### Images Not Loading?

**Issue:** Category/product images show as broken

**Solutions:**
1. Check if image URLs are valid
2. Verify image URL is publicly accessible
3. Try different image hosting service:
   - Supabase Storage
   - Cloudinary
   - ImgBB
   - Direct public URLs
4. Check for typos in URL

### Telegram Notifications Not Arriving?

**Issue:** Orders not sending to Telegram

**Solutions:**
1. Verify `VITE_TELEGRAM_BOT_TOKEN` in `.env.local`
2. Verify `VITE_TELEGRAM_CHAT_ID` in `.env.local`
3. Make sure bot is active (send it a message)
4. Check if credentials are correct:
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
5. Restart development server: Ctrl+C, then `npm run dev`

### Supabase Connection Error?

**Issue:** "Cannot find module '@supabase/supabase-js'"

**Solution:**
```bash
# Make sure dependencies are installed
npm install

# Or if using bun:
bun install
```

### Port 5173 Already in Use?

**Issue:** "Port 5173 is already in use"

**Solutions:**
1. Close other applications using port 5173
2. Kill existing process:
   ```bash
   # Windows PowerShell:
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   
   # Mac/Linux:
   lsof -i :5173
   kill -9 <PID>
   ```
3. Or run on different port:
   ```bash
   npm run dev -- --port 3000
   ```

### Clear Everything and Start Fresh?

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear React Query cache
# (Happens automatically on app start)

# Restart server
npm run dev
```

---

## Deployment

### Build for Production

```bash
npm run build

# Output:
# dist/index.html
# dist/assets/...
```

### Deployment Options

#### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com/
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables from `.env.local`
6. Click "Deploy"
7. Your site is live!

#### Option 2: Netlify

1. Push code to GitHub
2. Go to https://netlify.com/
3. Click "New site from Git"
4. Connect GitHub
5. Select repository
6. Add environment variables
7. Click "Deploy"

#### Option 3: Self-Hosted

```bash
# Build
npm run build

# Upload 'dist' folder to your server
# Configure server to serve index.html for all routes
# Set environment variables on server

# Your site is running!
```

### Environment Variables for Deployment

Before deploying, make sure to set these on your hosting platform:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_TELEGRAM_BOT_TOKEN=your_token
VITE_TELEGRAM_CHAT_ID=your_chat_id
VITE_ADMIN_PASSWORD=your_password
```

---

## File Structure

```
timber-strong-main/
├── src/
│   ├── components/
│   │   ├── admin/                 # Admin panel components
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── CategoriesAdmin.tsx
│   │   │   ├── ProductsAdmin.tsx
│   │   │   └── SubmissionsAdmin.tsx
│   │   ├── home/                  # Homepage components
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   └── ...
│   │   ├── layout/                # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── CheckoutModal.tsx      # Order modal
│   │   ├── ContactForm.tsx        # Contact form
│   │   └── DynamicProductGrid.tsx # Main product display
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client config
│   │   ├── api.ts                 # API/database operations
│   │   └── telegram.ts            # Telegram notifications
│   ├── pages/
│   │   ├── Index.tsx              # Homepage
│   │   ├── Products.tsx           # Products page
│   │   └── admin/                 # Admin pages
│   ├── App.tsx                    # Main app with routes
│   └── main.tsx                   # Entry point
├── public/                        # Static files
├── supabase_schema.sql            # Database schema
├── .env.example                   # Example env variables
├── package.json                   # Dependencies
├── vite.config.ts                 # Vite config
└── README.md                      # Project docs
```

---

## Quick Checklist

### Before Going Live

- [ ] Supabase project created and tables set up
- [ ] Telegram bot created and credentials saved
- [ ] `.env.local` filled with all credentials
- [ ] Admin password is strong
- [ ] At least one category created
- [ ] At least one product created
- [ ] Product images uploading correctly
- [ ] Admin login works
- [ ] "Buy Now" button works
- [ ] Telegram notifications arriving
- [ ] Website looks good on mobile
- [ ] All links working
- [ ] Contact form submitting
- [ ] Application built successfully: `npm run build`
- [ ] Deployed to hosting platform
- [ ] Custom domain set up (optional)
- [ ] SSL certificate enabled (automatic on Vercel/Netlify)

---

## Support & Resources

### Documentation Files
- `README.md` - Project overview
- `SETUP_GUIDE.md` - Setup instructions
- `FEATURES_OVERVIEW.md` - Feature description
- `CUSTOMIZATION_GUIDE.md` - How to customize
- `QUICK_REFERENCE.md` - Quick access guide

### External Resources
- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Vite Docs:** https://vitejs.dev/

### Getting Help
1. Check documentation files
2. Review browser console (F12)
3. Check Supabase dashboard for data
4. Test Telegram API manually
5. Review error messages carefully

---

## Summary

You now have a complete e-commerce system! 🎉

### Quick Start:
1. ✅ Install: `npm install`
2. ✅ Configure: Fill `.env.local`
3. ✅ Setup Supabase: Create tables
4. ✅ Setup Telegram: Get bot token & chat ID
5. ✅ Run: `npm run dev`
6. ✅ Login: http://localhost:5173/admin/login
7. ✅ Create: Add categories and products
8. ✅ Deploy: Push to production

### You're all set! Start managing your products! 🌳
