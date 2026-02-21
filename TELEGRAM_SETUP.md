# 🤖 Telegram Bot Setup Guide

## Understanding the Error

**What's happening:**
- Your frontend is trying to send messages directly to Telegram API
- Browser blocks this due to CORS (Cross-Origin Resource Sharing) policy
- Telegram API doesn't allow direct requests from browsers

**Why it fails:**
```
❌ Browser → Telegram API (BLOCKED - CORS)
✅ Backend/Server → Telegram API (ALLOWED)
```

---

## ✅ Solution: Use Backend/Server

### Option 1: Use Supabase Edge Functions (Recommended)

#### Step 1: Get Telegram Bot Token

1. **Open Telegram**
   - Search for: `@BotFather`
   - Click on it

2. **Create Bot**
   - Type: `/newbot`
   - Give it a name: `Timber Strong Orders Bot`
   - Give it a username: `timber_strong_bot` (must be unique, add numbers if taken)
   - Copy the **TOKEN** given to you
   - Example: `123456789:ABCDefGHIjklmnoPQRstuvWXyz`

3. **Get Chat ID**
   - Search for: `@userinfobot`
   - Click on it
   - Type: `/start`
   - Copy the **Chat ID** (numeric ID)
   - Example: `987654321`

#### Step 2: Create Supabase Edge Function

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project
   - Click: **Edge Functions** (left sidebar)
   - Click: **Create a new function**

2. **Name it**: `send-telegram-message`

3. **Replace the code with this:**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "https://deno.land/std@0.168.0/http/cors.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.description || "Failed to send message");
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
```

4. **Click: Deploy**

#### Step 3: Add Environment Variables

1. Click: **Settings** (in Edge Functions page)
2. Click: **Environment Variables**
3. Add these:

| Key | Value |
|-----|-------|
| `TELEGRAM_BOT_TOKEN` | `123456789:ABCDefGHIjklmnoPQRstuvWXyz` (from BotFather) |
| `TELEGRAM_CHAT_ID` | `987654321` (from userinfobot) |

4. **Save**

#### Step 4: Update Frontend Code

Edit: `src/lib/telegram.ts`

```typescript
import axios from 'axios';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const sendTelegramNotification = async (message: string): Promise<void> => {
  try {
    // Use Supabase Edge Function instead of direct API
    const response = await axios.post(
      `${SUPABASE_URL}/functions/v1/send-telegram-message`,
      { message },
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.success) {
      console.error('Telegram notification failed:', response.data.error);
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    // Don't throw - order should complete even if Telegram fails
  }
};

export const formatOrderNotification = (data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  productName?: string;
  type: 'contact' | 'order' | 'inquiry';
}): string => {
  return `
*New ${data.type.toUpperCase()} Received* 📬

*Name:* ${data.name}
*Phone:* ${data.phone}
*Email:* ${data.email}
*Product:* ${data.productName || 'General'}

*Message:*
${data.message}

---
_Sent from Timber Strong Website_
  `.trim();
};
```

#### Step 5: Test

1. Go to products page
2. Click "Buy"
3. Fill form and place order
4. Check your Telegram - should receive message ✅

---

## Option 2: Use Backend Server (If You Have One)

If you have your own Node.js/Express backend:

```javascript
// backend/routes/telegram.js
app.post('/api/telegram/send', async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

Then call from frontend:
```typescript
await fetch('http://your-backend.com/api/telegram/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message }),
});
```

---

## 🎯 Step-by-Step Setup (Quick Reference)

1. ✅ Message `@BotFather` on Telegram
2. ✅ Type `/newbot`
3. ✅ Get TOKEN from response
4. ✅ Message `@userinfobot` and get CHAT_ID
5. ✅ Create Edge Function in Supabase
6. ✅ Paste the TypeScript code above
7. ✅ Add TOKEN and CHAT_ID as env variables
8. ✅ Deploy function
9. ✅ Update `src/lib/telegram.ts` with new code
10. ✅ Test by placing an order

---

## 📝 Getting Bot Token & Chat ID

### Bot Token Example
```
1234567890:ABCdefGHIjklMNOpqrsTUVwxyzABCdefGHI
```
- From: `@BotFather` after `/newbot`

### Chat ID Example
```
987654321
```
- From: `@userinfobot` after `/start`
- Will look like: `Your user id is: 987654321`

---

## ✅ Verification

After setup, test:

```bash
# From terminal, test the bot token
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"chat_id":"YOUR_CHAT_ID","text":"Test message"}' \
  https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage
```

Should return:
```json
{"ok":true,"result":{...}}
```

---

## 🆘 Troubleshooting

| Error | Solution |
|-------|----------|
| `401 Unauthorized` | Wrong bot token - check @BotFather |
| `400 Bad Request` | Wrong chat ID - check @userinfobot |
| `CORS error` | Make sure using Edge Function or backend |
| `Message not received` | Chat ID might be private - send `/start` to @BotFather again |

---

## 📚 Resources

- Telegram Bot Docs: https://core.telegram.org/bots/api
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Create Bot: Message `@BotFather` on Telegram

---

**All set! Orders will now send Telegram notifications instantly.** ✅
