# Timber Strong - Setup Guide

## Overview
This is a complete e-commerce solution with:
- **Dynamic Product Management** with categories
- **Admin Panel** with authentication
- **Order Management** with multiple checkout options
- **Telegram Notifications** for orders and inquiries
- **Supabase Backend** for data storage

---

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
npm install
# or
bun install
```

### 2. **Setup Supabase**

#### Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your **Project URL** and **Anon Key** from Settings > API

#### Create Database Tables
1. Go to SQL Editor in Supabase
2. Copy and paste the entire content of `supabase_schema.sql`
3. Execute the SQL

**Tables created:**
- `categories` - Product categories
- `products` - Products with pricing and options
- `contact_submissions` - Orders and inquiries

### 3. **Setup Telegram Bot**

#### Create a Telegram Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot and get the **Bot Token**
3. Message your bot to activate it

#### Get Your Chat ID
1. Message your bot anything
2. Go to: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Find your Chat ID in the response

### 4. **Configure Environment Variables**

Create `.env.local` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
VITE_TELEGRAM_CHAT_ID=123456789
VITE_ADMIN_PASSWORD=your_secure_password_123
```

### 5. **Run the Application**

```bash
npm run dev
# or
bun run dev
```

The app will be available at `http://localhost:5173`

---

## 📱 How to Use

### **For Customers**

#### 1. Browse Products
- Visit the homepage
- Filter by category or view all products
- Each product displays price, description, and options

#### 2. Place an Order (3 Options)

**Option 1: Order Form**
- Click "Buy Now"
- Fill in the form
- Submit order → Notification sent to Telegram

**Option 2: WhatsApp Chat**
- Click "Buy Now"
- Select "WhatsApp" tab
- Chat directly with you

**Option 3: Direct Contact**
- Click "Buy Now"
- Select "Direct Contact" tab
- Email, call, or WhatsApp

#### 3. Send Inquiry
- Click "Inquiry" button
- Fill the contact form
- Submit → Notification sent to Telegram

---

### **For Admin**

#### Access Admin Panel
1. Go to `http://localhost:5173/admin/login`
2. Enter your admin password
3. You're now in the admin dashboard!

#### Admin Features

**Dashboard** (`/admin`)
- View statistics
- See recent orders/inquiries
- Chart of products per category

**Categories** (`/admin/categories`)
- Create new categories
- Add category image and description
- Edit or delete categories

**Products** (`/admin/products`)
- Add products with:
  - Name, description, price
  - Category assignment
  - Product image
  - Toggle "Buy Now" button
  - Toggle "Contact Us" button
- Edit or delete products
- View all products in a table

**Orders & Inquiries** (`/admin/submissions`)
- View all customer submissions
- Filter by type (orders vs inquiries)
- See customer details
- Delete submissions
- Click details to see full message

---

## 🔐 Security Notes

### Admin Authentication
- Currently uses simple password-based authentication
- Password stored in browser localStorage
- **For production:** Consider implementing:
  - Supabase Auth
  - OAuth (Google, GitHub)
  - JWT tokens
  - Row-level security policies

### Database Security
- Row-level security enabled
- Public read access for products/categories
- Insert access for contact submissions
- Restrict admin operations to authenticated users

---

## 📊 API Integration

### Contact Form Flow
```
Customer submits form
    ↓
Data saved to Supabase
    ↓
Telegram notification sent
    ↓
Admin receives alert
```

### Telegram Message Format
```
🛒 NEW ORDER / 📧 NEW CONTACT INQUIRY

Name: John Doe
Email: john@example.com
Phone: +91 9876543210
Product: Premium Teak Wood (if applicable)
Message: Customer's message here

Time: Feb 5, 2026 10:30 AM
```

---

## 🎨 Customization

### Change WhatsApp Number
In `src/components/DynamicProductGrid.tsx`:
```tsx
<DynamicProductGrid whatsappNumber="919876543210" />
```

### Change Admin Password
Update in `.env.local`:
```env
VITE_ADMIN_PASSWORD=your_new_password
```

### Customize Email Address
In `src/components/CheckoutModal.tsx`:
```tsx
href={`mailto:your-email@company.com?subject=${emailSubject}...`}
```

---

## 📂 Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx          # Admin dashboard layout
│   │   ├── AdminLogin.tsx           # Login page
│   │   ├── AdminDashboard.tsx       # Dashboard stats
│   │   ├── CategoriesAdmin.tsx      # Category management
│   │   ├── ProductsAdmin.tsx        # Product management
│   │   └── SubmissionsAdmin.tsx     # Orders & inquiries
│   ├── CheckoutModal.tsx            # Order checkout modal
│   ├── ContactForm.tsx              # Inquiry form
│   └── DynamicProductGrid.tsx       # Product display
├── lib/
│   ├── supabase.ts                  # Supabase client
│   ├── api.ts                       # Database services
│   └── telegram.ts                  # Telegram notifications
├── pages/
│   ├── admin/
│   │   ├── AdminPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── ProductsPage.tsx
│   │   └── SubmissionsPage.tsx
│   ├── Index.tsx                    # Home page
│   ├── Products.tsx                 # Products page
│   └── ...other pages
└── App.tsx                          # Main app with routes
```

---

## 🛠️ Troubleshooting

### Products not showing?
1. Check if categories exist in Supabase
2. Check if products have correct `category_id`
3. Verify Supabase credentials in `.env.local`

### Telegram messages not sending?
1. Verify bot token is correct
2. Verify chat ID is correct
3. Check browser console for errors
4. Make sure bot is not restricted

### Admin can't login?
1. Clear localStorage: `localStorage.clear()`
2. Verify admin password in `.env.local`
3. Reload the page

### Products not saving?
1. Check Supabase internet connection
2. Verify RLS policies are correct
3. Check browser console for errors

---

## 📞 Support

For issues or questions, check:
1. Browser console for error messages
2. Supabase dashboard for data
3. Make sure all environment variables are set
4. Verify Telegram bot is active

---

## 🎯 Next Steps

1. **Test the setup locally**
2. **Add your actual WhatsApp number**
3. **Add your email address**
4. **Upload product images**
5. **Deploy to production**

For deployment, consider:
- Vercel (recommended for Vite)
- Netlify
- GitHub Pages
- Self-hosted server

---

## License

This project is ready for production use!
