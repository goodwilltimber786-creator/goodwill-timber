# Quick Reference

## 🔐 Admin Panel Access

**URL:** `http://localhost:5173/admin/login`

**Default Password:** Check `.env.local` for `VITE_ADMIN_PASSWORD`

---

## 📍 Important URLs

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Homepage with products |
| Products | `/products` | All products page |
| Product Detail | `/products/:id` | Single product detail |
| About | `/about` | About page |
| Contact | `/contact` | Contact page |
| **Admin Login** | **/admin/login** | **Admin authentication** |
| **Admin Dashboard** | **/admin** | **Stats & overview** |
| **Categories** | **/admin/categories** | **Manage categories** |
| **Products** | **/admin/products** | **Manage products** |
| **Orders** | **/admin/submissions** | **View orders & inquiries** |

---

## 📋 Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxx

# Telegram
VITE_TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234...
VITE_TELEGRAM_CHAT_ID=123456789

# Admin
VITE_ADMIN_PASSWORD=secure_password_123
```

---

## 🎯 Feature Checklist

### Customer Features
- ✅ Browse products by category
- ✅ View product details
- ✅ Place order via form
- ✅ Order via WhatsApp
- ✅ Order via direct contact (email/call)
- ✅ Send inquiries
- ✅ Receive order confirmation

### Admin Features
- ✅ Login with password
- ✅ View dashboard with stats
- ✅ Create/edit/delete categories
- ✅ Create/edit/delete products
- ✅ Toggle "Buy Now" option
- ✅ Toggle "Contact Us" option
- ✅ View all orders & inquiries
- ✅ See customer details
- ✅ Delete submissions

### Backend Features
- ✅ Supabase database integration
- ✅ Automatic Telegram notifications
- ✅ Order form validation
- ✅ Data persistence
- ✅ Real-time updates

---

## 🚀 Deployment Steps

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Deploy to:
   - **Vercel** (easiest)
   - **Netlify**
   - **GitHub Pages**
   - Your own server

---

## 💡 Pro Tips

1. **Backup your Supabase data regularly**
2. **Change admin password in production**
3. **Use environment variables for sensitive data**
4. **Monitor Telegram for notifications**
5. **Test forms before going live**

---

## 📞 Quick Contacts to Update

In `.env.local`:
- **Email:** Search for `info@timberstrong.com` and replace with your email
- **WhatsApp:** Search for `919876543210` and replace with your number
- **Admin Password:** Change from default

---

## 🐛 Debug Mode

Open browser console (F12) to see:
- API response logs
- Telegram notification status
- Form validation errors
- Database query results

---

Last Updated: February 5, 2026
