// Netlify fires this automatically on every verified (non-spam) form submission.
// The filename is the trigger — do not rename it.
//
// Required environment variables (set in Netlify, never committed):
//   TELEGRAM_BOT_TOKEN  — from @BotFather
//   TELEGRAM_CHAT_ID    — the chat/group that should receive alerts
//
// Supabase connection — the anon key is already public in the website's config.js,
// so it is safe to use here. All tables are protected by row-level security.
const SUPABASE_URL      = 'https://drgwfjoirmgxwhclbaak.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZ3dmam9pcm1neHdoY2xiYWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NzcwMTAsImV4cCI6MjEwNzA1MzAxMH0.S1CnUIgIwzM9J8Qaom1A2vfalTFpmtXo1oTmLLznlbI';

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

// Forms that create a lead in the CRM.
// Every form on the site is listed here, so every submission reaches the CRM *and* Telegram.
const CRM_FORMS = new Set([
  'schedule-tour', 'contact', 'waitlist', 'bloom-interest', 'family-support', 'registration',
  'pno-booking', 'pno-date-request', 'pno-waitlist',
]);

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

// ── Supabase / CRM helpers ────────────────────────────────────────────────────

function join(...parts) {
  return parts.filter(Boolean).join(' ') || null;
}

function orNull(v) {
  return (v === '' || v == null) ? null : v;
}

// Map a Netlify form submission to a leads-table row.
function mapToLead(formName, data) {
  const d = data || {};

  if (formName === 'schedule-tour') {
    const parentName = join(d['parent-first-name'], d['parent-last-name']);
    const childName  = join(d['child-first-name'],  d['child-last-name']);

    // Combine the new "about your little one" answers + freeform notes into message.
    const parts = [];
    if (d['been-in-school'])  parts.push(`Been in school before: ${d['been-in-school']}`);
    if (d['looking-for'])     parts.push(`Looking for in a school:\n${d['looking-for']}`);
    if (d['notes'])           parts.push(d['notes']);
    const days = Array.isArray(d['days[]']) ? d['days[]'].join(', ') : orNull(d['days[]']);
    if (days)                 parts.push(`Preferred days: ${days}`);
    if (d['time-pref'])       parts.push(`Preferred time: ${d['time-pref']}`);

    let heardFrom = orNull(d['referral']);
    if (d['referred-by']) heardFrom = [heardFrom, d['referred-by']].filter(Boolean).join(' — ');

    return {
      source:       'schedule-tour',
      stage:        'new',
      parent_name:  parentName,
      email:        orNull(d['email']),
      phone:        orNull(d['phone']),
      contact_pref: orNull(d['contact-pref']),
      child_name:   childName,
      child_dob:    orNull(d['child-dob']),
      program:      orNull(d['program']),
      desired_start: orNull(d['start-time']),
      heard_from:   heardFrom,
      message:      parts.length ? parts.join('\n\n') : null,
    };
  }

  if (formName === 'contact') {
    const name = join(d['first-name'], d['last-name']) || orNull(d['name']);
    return {
      source:      'contact',
      stage:       'new',
      parent_name: name,
      email:       orNull(d['email']),
      phone:       orNull(d['phone']),
      message:     orNull(d['message'] || d['notes']),
    };
  }

  if (formName === 'waitlist') {
    const parentName = join(d['parent-first-name'], d['parent-last-name']) || orNull(d['name']);
    const childName  = join(d['child-first-name'],  d['child-last-name'])  || orNull(d['child-name']);
    return {
      source:      'waitlist',
      stage:       'new',
      parent_name: parentName,
      email:       orNull(d['email']),
      phone:       orNull(d['phone']),
      child_name:  childName,
      child_dob:   orNull(d['child-dob']),
      program:     orNull(d['program']),
      message:     orNull(d['notes']),
    };
  }

  if (formName === 'bloom-interest') {
    return {
      source:      'bloom-interest',
      stage:       'new',
      parent_name: orNull(d['name']),
      email:       orNull(d['email']),
      phone:       orNull(d['phone']),
      message:     orNull(d['message'] || d['notes']),
    };
  }

  if (formName === 'family-support') {
    const parentName = join(d['parent-first-name'], d['parent-last-name']) || orNull(d['name']);
    return {
      source:      'family-support',
      stage:       'new',
      parent_name: parentName,
      email:       orNull(d['email']),
      phone:       orNull(d['phone']),
      child_name:  join(d['child-first-name'], d['child-last-name']) || null,
      message:     orNull(d['message'] || d['notes']),
    };
  }

  if (formName === 'pno-booking') {
    const parts = [];
    if (d['preferred_date'])        parts.push(`Parents Night Out date: ${d['preferred_date']}`);
    if (d['num_children'])          parts.push(`Number of children: ${d['num_children']}`);
    if (d['emergency_contact'])     parts.push(`Emergency contact: ${d['emergency_contact']}`);
    if (d['allergies'])             parts.push(`Allergies / dietary needs: ${d['allergies']}`);
    if (d['special_instructions'])  parts.push(`Special instructions: ${d['special_instructions']}`);
    if (d['promo_code'])            parts.push(`Promo code: ${d['promo_code']}`);
    return {
      source:      'pno-booking',
      stage:       'new',
      parent_name: orNull(d['parent_name']),
      email:       orNull(d['email']),
      phone:       orNull(d['phone']),
      message:     parts.length ? parts.join('\n') : null,
    };
  }

  if (formName === 'pno-date-request') {
    const parts = [];
    if (d['preferred_dates']) parts.push(`Preferred dates: ${d['preferred_dates']}`);
    if (d['notes'])           parts.push(d['notes']);
    return {
      source:      'pno-date-request',
      stage:       'new',
      parent_name: orNull(d['name']),
      email:       orNull(d['email']),
      phone:       orNull(d['phone']),
      message:     parts.length ? parts.join('\n') : null,
    };
  }

  if (formName === 'pno-waitlist') {
    return {
      source:      'pno-waitlist',
      stage:       'new',
      parent_name: orNull(d['name']),
      email:       orNull(d['email']),
      phone:       orNull(d['phone']),
      message:     d['event_date'] ? `Parents Night Out waitlist: ${d['event_date']}` : null,
    };
  }

  if (formName === 'registration') {
    const parentName = join(d['parent-first-name'], d['parent-last-name']);
    const childName  = join(d['child-first-name'],  d['child-last-name']);
    const parts = [];
    if (d['vpk'])           parts.push(`VPK: ${d['vpk']}`);
    if (d['financial-aid']) parts.push(`Financial aid: ${d['financial-aid']}`);
    if (d['notes'])         parts.push(d['notes']);
    return {
      source:       'registration',
      stage:        'new',
      parent_name:  parentName,
      email:        orNull(d['email']),
      phone:        orNull(d['phone']),
      child_name:   childName,
      child_dob:    orNull(d['child-dob']),
      program:      orNull(d['program']),
      message:      parts.length ? parts.join('\n\n') : null,
    };
  }

  return null;
}

async function pushToSupabase(formName, data) {
  const lead = mapToLead(formName, data);
  if (!lead) return;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey':        SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer':        'return=minimal',
    },
    body: JSON.stringify(lead),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase ${res.status}: ${text.slice(0, 300)}`);
  }
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

  // 2. CRM lead insert
  if (CRM_FORMS.has(formName)) {
    try {
      await pushToSupabase(formName, payload.data || {});
      console.log(`CRM lead created for "${formName}".`);
      results.push('crm:ok');
    } catch (err) {
      console.error('CRM lead insert failed:', err.message);
      results.push(`crm:failed(${err.message})`);
    }
  }

  return { statusCode: 200, body: results.join(' | ') };
};

// Exported for the local test script.
module.exports.buildMessage = buildMessage;
