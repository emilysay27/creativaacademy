#!/usr/bin/env node
// Sends one clearly-marked test notification to Telegram.
//
//   TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=yyy node netlify/functions/test-notification.js
//
// Add --preview to print the message instead of sending it (no token needed).

const { handler, buildMessage } = require('./submission-created.js');

const sample = {
  payload: {
    form_name: 'family-support',
    created_at: new Date().toISOString(),
    human_fields: {
      'Name': 'ZZ TEST — Telegram setup check',
      'Phone': '(786) 000-0000',
      'Email': 'test@example.invalid',
      'Preferred contact method': 'Phone call',
      'Program': 'FES / Step Up',
      'Type of help': 'General information',
    },
    data: {},
  },
};

if (process.argv.includes('--preview')) {
  console.log('--- message preview ---\n');
  console.log(buildMessage(sample.payload));
  process.exit(0);
}

if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
  console.error('Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID, or pass --preview.');
  process.exit(1);
}

handler({ body: JSON.stringify(sample) })
  .then((res) => {
    console.log(res.body);
    process.exit(res.body.startsWith('Notification sent') ? 0 : 1);
  })
  .catch((err) => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
