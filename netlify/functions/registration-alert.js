// Short Telegram heads-up when a family finishes the online registration (/register/).
//
// The full registration (allergies, medicine, pick-ups, health, family details) goes ONLY to the
// Creativa CRM, straight from the page. This function never sees any of that. The page sends just the
// child's first name and classroom after the CRM has accepted the registration.
//
// Uses the same Netlify environment variables as submission-created.js:
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

const ALLOWED_HOSTS = ['creativaacademy.com', 'www.creativaacademy.com'];

function clean(value, max) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u001f<>&]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function fromOurSite(headers) {
  const origin = headers.origin || headers.referer || '';
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_HOSTS.includes(host) || host.endsWith('--creativamainsite.netlify.app') || host === 'creativamainsite.netlify.app';
  } catch {
    return false;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'POST only' };
  if (!fromOurSite(event.headers || {})) return { statusCode: 403, body: 'Not allowed' };

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, body: 'Bad request' }; }

  const child = clean(body.child, 40);
  const program = clean(body.program, 40);
  if (!child) return { statusCode: 400, body: 'Missing child name' };

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID.');
    return { statusCode: 200, body: 'Skipped: no Telegram config' };
  }

  const text =
    '📝 <b>New Online Registration</b>\n\n' +
    `<b>Child:</b> ${child}${program ? ' · ' + program : ''}\n\n` +
    'Full details are in the CRM. Reminder: $300 cash registration fee is paid at document drop-off.';

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    if (!res.ok) throw new Error(`Telegram ${res.status}`);
    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    console.error('Registration alert failed:', err.message);
    return { statusCode: 200, body: 'Telegram failed' };
  }
};
