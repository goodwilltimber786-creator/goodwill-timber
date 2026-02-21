#!/usr/bin/env node

/**
 * Telegram Connection Test
 * Run this to verify your Telegram bot and chat ID are working
 */

const https = require('https');

const BOT_TOKEN = '8241764675:AAF6a49tQzbi7Q_2P2ZnR0QqFeee7xKQNLY';
const CHAT_ID = '1358981520';

console.log('🔍 Testing Telegram Connection...\n');
console.log(`Bot Token: ${BOT_TOKEN.substring(0, 10)}...`);
console.log(`Chat ID: ${CHAT_ID}\n`);

const testMessage = `✅ Timber Strong - Test Message\n\nTimestamp: ${new Date().toLocaleString()}\n\nIf you see this, your Telegram integration is working!`;

const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

const postData = JSON.stringify({
  chat_id: CHAT_ID,
  text: testMessage,
  parse_mode: 'HTML',
});

const options = {
  hostname: 'api.telegram.org',
  path: `/bot${BOT_TOKEN}/sendMessage`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

console.log('📤 Sending test message to Telegram...\n');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`Response Status: ${res.statusCode}`);
    console.log('Response Body:');
    
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));
      
      if (jsonData.ok) {
        console.log('\n✅ SUCCESS! Your Telegram integration is working correctly!');
        console.log(`Message ID: ${jsonData.result.message_id}`);
      } else {
        console.log('\n❌ Error from Telegram API:');
        console.log(jsonData.description);
      }
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Error: ${e.message}`);
});

req.write(postData);
req.end();
