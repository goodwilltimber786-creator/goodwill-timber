import axios from 'axios';

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export const sendTelegramNotification = async (message: string) => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return false;
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    });

    return response.data.ok;
  } catch (error) {
    return false;
  }
};

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
