# Customization Guide

## 1. Change WhatsApp Number

### Location 1: DynamicProductGrid Component
File: `src/components/DynamicProductGrid.tsx`

**Find this line (line 17):**
```tsx
export const DynamicProductGrid = ({ whatsappNumber = '919876543210' }: { whatsappNumber?: string }) => {
```

**Change to your number:**
```tsx
export const DynamicProductGrid = ({ whatsappNumber = 'YOUR_COUNTRY_CODE+YOUR_NUMBER' }: { whatsappNumber?: string }) => {
```

**Example:**
```tsx
// For India: +91 98765 43210
export const DynamicProductGrid = ({ whatsappNumber = '919876543210' }: ...

// For USA: +1 234 567 8900
export const DynamicProductGrid = ({ whatsappNumber = '12345678900' }: ...

// For UK: +44 1234 567890
export const DynamicProductGrid = ({ whatsappNumber = '441234567890' }: ...
```

### Location 2: Products Page
File: `src/pages/Products.tsx`

**Find this line (around line 20):**
```tsx
<DynamicProductGrid whatsappNumber="919876543210" />
```

**Change to your number:**
```tsx
<DynamicProductGrid whatsappNumber="YOUR_COUNTRY_CODE+YOUR_NUMBER" />
```

### Location 3: Homepage
If you add DynamicProductGrid to homepage, update there too.

---

## 2. Change Email Address

### Location: CheckoutModal Component
File: `src/components/CheckoutModal.tsx`

**Find this line (around line 47):**
```tsx
href={`mailto:info@timberstrong.com?subject=${emailSubject}&body=${emailBody}`}
```

**Change to your email:**
```tsx
href={`mailto:your-email@yourcompany.com?subject=${emailSubject}&body=${emailBody}`}
```

**Example:**
```tsx
// Before
href={`mailto:info@timberstrong.com?subject=${emailSubject}&body=${emailBody}`}

// After (your actual email)
href={`mailto:contact@yourcompany.com?subject=${emailSubject}&body=${emailBody}`}
```

---

## 3. Change Phone Number

### Location: CheckoutModal Component
File: `src/components/CheckoutModal.tsx`

**Find this section (around line 40):**
```tsx
{/* Phone Option */}
<a href={`tel:+91${whatsappNumber.replace(/\D/g, '')}`}>
```

This automatically extracts digits from WhatsApp number. If you want a different phone:

**Change to:**
```tsx
{/* Phone Option */}
<a href={`tel:+919876543210`}>
```

**Example:**
```tsx
// Different numbers for WhatsApp and Phone
<a href={`tel:+919876543210`}>  {/* Change this number */}
```

---

## 4. Change Admin Password

### Option 1: Environment Variable (Recommended)
File: `.env.local`

```env
VITE_ADMIN_PASSWORD=your_new_secure_password_here
```

**Example:**
```env
VITE_ADMIN_PASSWORD=MySecurePassword123!@#
VITE_ADMIN_PASSWORD=admin2024
VITE_ADMIN_PASSWORD=timber_admin_pwd
```

### Option 2: Default Fallback
File: `src/components/admin/AdminLogin.tsx`

**Find this line (around line 7):**
```tsx
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
```

**Change default fallback:**
```tsx
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'your_default_password';
```

---

## 5. Change Telegram Bot Details

### Location: Environment Variables
File: `.env.local`

```env
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_TELEGRAM_CHAT_ID=your_chat_id_here
```

**How to get these:**

1. **Create Telegram Bot:**
   - Message [@BotFather](https://t.me/botfather)
   - Type `/newbot`
   - Follow prompts
   - Copy the token

2. **Get Chat ID:**
   - Message your new bot
   - Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Find `"chat"{"id": XXXX}`
   - That's your chat ID

**Example:**
```env
VITE_TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
VITE_TELEGRAM_CHAT_ID=987654321
```

---

## 6. Customize Telegram Message Format

File: `src/lib/telegram.ts`

**Find the `formatOrderNotification` function (around line 26):**
```tsx
export const formatOrderNotification = (data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  productName?: string;
  type: 'contact' | 'order';
}): string => {
  const header = data.type === 'order' ? '🛒 <b>NEW ORDER</b>' : '📧 <b>NEW CONTACT INQUIRY</b>';
  
  return `${header}

<b>Name:</b> ${data.name}
<b>Email:</b> ${data.email}
<b>Phone:</b> ${data.phone}
${data.productName ? `<b>Product:</b> ${data.productName}` : ''}
<b>Message:</b>
${data.message}

<b>Time:</b> ${new Date().toLocaleString()}`;
};
```

**Customize the message:**
```tsx
export const formatOrderNotification = (data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  productName?: string;
  type: 'contact' | 'order';
}): string => {
  const header = data.type === 'order' 
    ? '🛒 <b>NEW ORDER - URGENT!</b>' 
    : '📧 <b>NEW INQUIRY</b>';
  
  return `${header}

👤 <b>Customer Name:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
📱 <b>Contact:</b> ${data.phone}
${data.productName ? `📦 <b>Product:</b> ${data.productName}` : ''}
💬 <b>Message:</b>
${data.message}

⏰ <b>Received:</b> ${new Date().toLocaleString()}
---
<i>Timber Strong Order Management</i>`;
};
```

---

## 7. Change Favicon & Page Title

### Favicon
File: `public/favicon.ico`

Replace with your own favicon image.

### Page Title & Meta
File: `index.html`

**Find:**
```html
<title>Timber Strong</title>
<meta name="description" content="Premium timber, plywood, doors and hardware solutions">
```

**Change to:**
```html
<title>Your Company Name</title>
<meta name="description" content="Your company description here">
```

---

## 8. Change Company Colors

File: `tailwind.config.ts`

Look for the theme section and customize colors:
```ts
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
      // etc
    }
  }
}
```

---

## 9. Change Contact Form Email Subject

File: `src/components/CheckoutModal.tsx`

**Find (around line 35):**
```tsx
const emailSubject = encodeURIComponent(`Order Inquiry: ${product.name}`);
```

**Change to:**
```tsx
const emailSubject = encodeURIComponent(`New Order from Timber Strong: ${product.name}`);
```

---

## 10. Change Company Name Throughout

### Search & Replace
Use your editor's Find & Replace feature (Ctrl+H):

**Find:** `Timber Strong`
**Replace with:** `Your Company Name`

**Files to check:**
- `index.html`
- `package.json`
- `src/components/admin/AdminLayout.tsx`
- `src/App.tsx`
- Documentation files

---

## Quick Reference

### Before Deployment Checklist

- [ ] WhatsApp number updated in 2 locations
- [ ] Email address changed in CheckoutModal
- [ ] Phone number updated (optional)
- [ ] Admin password changed
- [ ] Telegram bot token in `.env.local`
- [ ] Telegram chat ID in `.env.local`
- [ ] Supabase URL in `.env.local`
- [ ] Supabase Anon Key in `.env.local`
- [ ] Company name updated
- [ ] Favicon changed (optional)
- [ ] Page title updated
- [ ] Colors customized (optional)

---

## Example Full Customization

### Before
```env
VITE_SUPABASE_URL=https://example.supabase.co
VITE_SUPABASE_ANON_KEY=xxx...
VITE_TELEGRAM_BOT_TOKEN=123456:ABC...
VITE_TELEGRAM_CHAT_ID=987654321
VITE_ADMIN_PASSWORD=admin123
```

### After
```env
VITE_SUPABASE_URL=https://mycompany.supabase.co
VITE_SUPABASE_ANON_KEY=my_actual_key...
VITE_TELEGRAM_BOT_TOKEN=111111:XYZ...
VITE_TELEGRAM_CHAT_ID=111111111
VITE_ADMIN_PASSWORD=MySecurePass@2024
```

### Code Changes
```
WhatsApp: 919876543210 → 14155552671 (for USA)
Email: info@timberstrong.com → sales@mycompany.com
Phone: +919876543210 → +14155552671
Company: Timber Strong → Your Company
```

---

## After Customization

1. ✅ Save all changes
2. ✅ Run `npm install` (if added packages)
3. ✅ Run `npm run dev` to test locally
4. ✅ Test admin panel login
5. ✅ Test product creation
6. ✅ Test "Buy Now" with your WhatsApp
7. ✅ Test email link
8. ✅ Test Telegram notification
9. ✅ Ready to deploy!

---

## Support

If you need to change something else, check:
- Component files in `src/components/`
- Page files in `src/pages/`
- Library files in `src/lib/`
- Configuration files in project root

Feel free to customize everything to match your brand! 🎉
