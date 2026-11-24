// Netlify fires this automatically on every verified (non-spam) form submission.
// The filename is the trigger — do not rename it.
//
// Required environment variables (set in Netlify, never committed):
//   TELEGRAM_BOT_TOKEN  — from @BotFather
//   TELEGRAM_CHAT_ID    — the chat/group that should receive alerts
//
// This function only sends the Telegram alert. The CRM gets its own copy of the enrollment forms (tour, waitlist,
// contact, Bloom, family support) from Netlify: Form notifications → Outgoing webhook to
// crm.creativaacademy.com/.netlify/functions/website-form.

const TELEGRAM_API = 'https://api.telegram.org';
const MAX_MESSAGE  = 4096; // Telegram's hard limit

// Friendly names + icons so a glance at the phone tells you which form fired.
const FORM_LABELS = {
  'contact':          { icon: '✉️',  name: 'Contact Message' },
  'schedule-tour':    { icon: '🗓️',  name: 'Tour Request' },
  'waitlist':         { icon: '📋',  name: 'Waitlist Signup' },
  'bloom-interest':   { icon: '🌸',  name: 'Bloom Interest' },
  'family-support':   { icon: '🌿',  name: 'Family Support Request' },
  'pno-booking':      { icon: '🌙',  name: 'Parents Night Out — Booking' },
  'pno-date-request': { icon: '🌙',  name: 'Parents Night Out — Date Request' },
  'pno-waitlist':     { icon: '🌙',  name: 'Parents Night Out — Waitlist' },
  'registration':     { icon: '📝',  name: 'Enrollment Confirmation' },
};

// Netlify attaches these to every submission; they're noise in a phone alert.
const INTERNAL_FIELDS = new Set([
  'form-name', 'bot-field', 'ip', 'user_agent', 'referrer',
]);

// ── Telegram helpers ──────────────────────────────────────────────────────────

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatTimestamp(iso) {
  try {
    return new Date(iso).toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso || 'unknown';
  }
}

function collectFields(payload) {
  const human = payload.human_fields || {};
  if (Object.keys(human).length > 0) {
    return Object.entries(human).filter(([, v]) => v !== '' && v != null);
  }
  return Object.entries(payload.data || {})
    .filter(([k, v]) => !INTERNAL_FIELDS.has(k) && v !== '' && v != null);
}

function buildMessage(payload) {
  const meta = FORM_LABELS[payload.form_name] || { icon: '📩', name: payload.form_name || 'Form Submission' };
  const lines = [`${meta.icon} <b>${escapeHtml(meta.name)}</b>`, ''];
  for (const [label, value] of collectFields(payload)) {
    const text = Array.isArray(value) ? value.join(', ') : value;
    lines.push(`<b>${escapeHtml(label)}:</b> ${escapeHtml(text)}`);
  }
  lines.push('', `<i>Received ${escapeHtml(formatTimestamp(payload.created_at))}</i>`);
  let message = lines.join('\n');
  if (message.length > MAX_MESSAGE) {
    message = message.slice(0, MAX_MESSAGE - 40) + '\n\n<i>… truncated</i>';
  }
  return message;
}

async function sendTelegram(token, chatId, text) {
  const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.ok === false) {
    throw new Error(`Telegram ${res.status}: ${body.description || 'unknown error'}`);
  }
  return body;
}

// ── Handler ───────────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  let payload;
  try {
    payload = JSON.parse(event.body || '{}').payload;
  } catch (err) {
    console.error('Could not parse submission payload:', err.message);
    return { statusCode: 200, body: 'Skipped: unparseable payload.' };
  }

  if (!payload) {
    console.error('No payload on submission event.');
    return { statusCode: 200, body: 'Skipped: no payload.' };
  }

  const formName = payload.form_name;
  const results  = [];

  // 1. Telegram notification
  if (!token || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID; skipping Telegram.');
    results.push('telegram:skipped(no config)');
  } else {
    try {
      await sendTelegram(token, chatId, buildMessage(payload));
      console.log(`Telegram notification sent for "${formName}".`);
      results.push('telegram:ok');
    } catch (err) {
      console.error('Telegram notification failed:', err.message);
      results.push(`telegram:failed(${err.message})`);
    }
  }

  return { statusCode: 200, body: results.join(' | ') };
};

// Exported for the local test script.
module.exports.buildMessage = buildMessage;
