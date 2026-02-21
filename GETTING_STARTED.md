# 🚀 Getting Started - Timber Strong Project

Welcome! Your Timber Strong e-commerce platform is ready. This guide gets you up and running in **5 minutes**.

---

## 📋 Quick Checklist

- [ ] Have Node.js installed? (Check: `node --version`)
- [ ] Dependencies installed? (Run: `npm install`)
- [ ] `.env` file configured? (See below)
- [ ] Supabase database ready? (See setup guide)
- [ ] Telegram bot created? (Optional but recommended)

---

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Install Dependencies (30 seconds)
```bash
npm install
```

### 2️⃣ Start Development Server (10 seconds)
```bash
npm run dev
```

You'll see:
```
➜  Local:   http://localhost:5173/
➜  Press h to show help
```

### 3️⃣ Open in Browser (5 seconds)
- **Frontend:** http://localhost:5173/
- **Admin Panel:** http://localhost:5173/admin/login
- **Admin Password:** Check `.env` file for `VITE_ADMIN_PASSWORD`

### 4️⃣ Login to Admin Panel (2 minutes)
1. Go to http://localhost:5173/admin/login
2. Enter password: `Admin@123` (from your `.env` file)
3. Click "Login"
4. You're in! 🎉

### 5️⃣ Add Your First Product (2 minutes)
1. Click "Products" in sidebar
2. Click "Add Product" button
3. Fill in details (name, price, category, image)
4. Click "Create"
5. Go back to homepage - see your product!

---

## 🔑 Your Current Configuration

Your `.env` file is already configured with:

```env
✅ VITE_SUPABASE_URL              → Database connection ready
✅ VITE_SUPABASE_ANON_KEY         → Database authenticated
⚠️  VITE_TELEGRAM_BOT_TOKEN       → Not configured (orders won't send to Telegram)
⚠️  VITE_TELEGRAM_CHAT_ID         → Not configured (orders won't send to Telegram)
✅ VITE_ADMIN_PASSWORD             → Admin@123
```

---

## 📚 Documentation Guide

### Start Here:
1. **This File** - Quick overview and getting started
2. **ADMIN_LOGIN_GUIDE.md** - How to login to admin panel
3. **QUICK_REFERENCE.md** - Quick reference for all features

### For Detailed Setup:
4. **COMPLETE_SETUP_GUIDE.md** - Full step-by-step setup with screenshots
5. **FEATURES_OVERVIEW.md** - All features explained
6. **CUSTOMIZATION_GUIDE.md** - How to customize everything

### For Specific Topics:
7. **SETUP_GUIDE.md** - Installation instructions
8. **FRONTEND_UPDATES.md** - Frontend changes explained
9. **BEFORE_AFTER_GUIDE.md** - What changed from static to dynamic
10. **ADMIN_LOGIN_VISUAL_GUIDE.md** - Visual login walkthrough

---

## 🎯 What Can You Do?

### As Admin:
- ✅ Add/Edit/Delete product categories
- ✅ Add/Edit/Delete products with prices
- ✅ View customer orders and inquiries
- ✅ See admin dashboard with statistics
- ✅ Download/view submitted forms

### As Customer:
- ✅ Browse categories
- ✅ View products with prices
- ✅ Buy products with checkout options:
  - 📋 Fill order form
  - 🟢 WhatsApp direct link
  - 📞 Direct contact (phone/email)
- ✅ Get instant confirmation
- ✅ Receive tracking (when Telegram enabled)

---

## 🔧 Common First Tasks

### Task 1: Change Admin Password
```bash
1. Open .env file
2. Find: VITE_ADMIN_PASSWORD=Admin@123
3. Change to: VITE_ADMIN_PASSWORD=YourNewPassword123!
4. Save file
5. Restart server: npm run dev
6. Login with new password
```

### Task 2: Enable Telegram Notifications
```bash
1. Create Telegram bot (@BotFather) - see CUSTOMIZATION_GUIDE.md
2. Get bot token and chat ID
3. Update .env:
   VITE_TELEGRAM_BOT_TOKEN=your_token_here
   VITE_TELEGRAM_CHAT_ID=your_chat_id_here
4. Restart server
5. Test by placing an order
```

### Task 3: Add First Product
```bash
1. Go to: http://localhost:5173/admin/login
2. Login with Admin@123
3. Click "Categories" → "Add Category"
4. Fill in name, description, image URL
5. Click "Create"
6. Click "Products" → "Add Product"
7. Fill in details, select category
8. Click "Create"
9. View on homepage!
```

### Task 4: Customize Business Info
See **CUSTOMIZATION_GUIDE.md** for:
- Change WhatsApp number
- Change business email
- Change business phone
- Change colors
- Change company name

---

## 🚀 Next Steps

### Immediate (Today):
1. ✅ Get server running: `npm run dev`
2. ✅ Login to admin: http://localhost:5173/admin/login
3. ✅ Add first category
4. ✅ Add first product
5. ✅ Test checkout on homepage

### Soon (This Week):
1. Set up Telegram notifications (optional)
2. Add all your products and categories
3. Customize colors and branding
4. Test all checkout options
5. Share with first customers

### Later (Before Launch):
1. Build for production: `npm run build`
2. Deploy to hosting (Vercel/Netlify - see COMPLETE_SETUP_GUIDE.md)
3. Set up custom domain
4. Monitor orders
5. Gather customer feedback

---

## ❓ Quick Answers

### Q: Can't see my products on homepage?
**A:** 
1. Make sure you're logged in to admin
2. Make sure you added products
3. Make sure products are linked to a category
4. Refresh homepage (Ctrl+R)
5. Check browser console for errors (F12)

### Q: Admin login not working?
**A:**
1. Check `.env` file for `VITE_ADMIN_PASSWORD`
2. Make sure you typed it correctly (case-sensitive)
3. Make sure server is running
4. Try private/incognito window
5. Clear browser cache (Ctrl+Shift+Delete)

### Q: Orders not sending to Telegram?
**A:**
1. Telegram credentials not set? Set them in `.env`
2. Forgot to restart server after changing `.env`?
3. Bot token incorrect? Re-check @BotFather
4. Not in correct chat? Verify chat ID
5. See CUSTOMIZATION_GUIDE.md for help

### Q: Where's my password?
**A:** 
Check `.env` file:
```
VITE_ADMIN_PASSWORD=Admin@123
```

---

## 📞 Support Resources

### In This Project:
- 📖 **Documentation files** - Answers to most questions
- 💻 **Code comments** - Explanations in source code
- 🔍 **Browser DevTools** - Debug errors (F12)

### Online Resources:
- [Supabase Docs](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🎓 Project Structure

```
📦 Project Root
├── src/
│   ├── components/          ← React components
│   │   ├── admin/          ← Admin dashboard components
│   │   ├── home/           ← Homepage components
│   │   ├── layout/         ← Layout components (navbar, footer)
│   │   └── ui/             ← Reusable UI components
│   ├── pages/              ← Page components (routes)
│   ├── lib/                ← Utilities
│   │   ├── supabase.ts     ← Database connection
│   │   ├── api.ts          ← API functions
│   │   └── telegram.ts     ← Telegram integration
│   ├── App.tsx             ← Main app component with routing
│   └── main.tsx            ← Entry point
├── .env                    ← Your configuration (DO NOT COMMIT)
├── package.json            ← Dependencies
├── vite.config.ts          ← Vite configuration
└── README.md               ← Project README
```

---

## 🔐 Security Notes

### Before Going Live:

1. **Change Admin Password**
   ```env
   VITE_ADMIN_PASSWORD=StrongPassword123!@#
   ```
   Use a strong password with:
   - Uppercase letters
   - Lowercase letters
   - Numbers
   - Special characters

2. **Protect `.env` File**
   - Never commit to GitHub
   - Already in `.gitignore`
   - Never share credentials

3. **Use HTTPS on Production**
   - Required for security
   - Hosting platforms provide this

4. **Consider Better Auth**
   - Current: Simple password
   - For production: Add OAuth, JWT, or email authentication
   - See CUSTOMIZATION_GUIDE.md for options

---

## 📊 Features Overview

### Frontend Features:
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dynamic categories from database
- ✅ Dynamic products from database
- ✅ Product search and filtering
- ✅ Beautiful product cards
- ✅ Three checkout options
- ✅ Form validation
- ✅ Toast notifications

### Admin Features:
- ✅ Secure login with password
- ✅ Dashboard with statistics
- ✅ Add/Edit/Delete categories
- ✅ Add/Edit/Delete products
- ✅ View all orders and inquiries
- ✅ Real-time data updates
- ✅ Responsive admin panel

### Backend Features:
- ✅ Supabase cloud database
- ✅ Real-time data synchronization
- ✅ Telegram notifications
- ✅ Order tracking
- ✅ Inquiry management
- ✅ Database backups (Supabase handles)

---

## 🎉 You're All Set!

Your project is:
- ✅ Fully configured
- ✅ Database connected
- ✅ Admin panel ready
- ✅ Frontend working
- ✅ Ready to add products

### Start Now:
```bash
npm run dev
```

Then visit:
- Frontend: http://localhost:5173/
- Admin: http://localhost:5173/admin/login

**Enjoy! 🌳**

---

## 📝 Next Actions

1. Run `npm run dev`
2. Go to http://localhost:5173/admin/login
3. Login with `Admin@123`
4. Add your first category
5. Add your first product
6. See it on the homepage!

**That's it! You're now running your e-commerce platform.** 🚀

---

Last Updated: 2024
Version: 1.0
