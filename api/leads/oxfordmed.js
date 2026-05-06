// Vercel Serverless Function — /api/leads/oxfordmed
// POST /api/leads/oxfordmed
//
// RELEASE 1 (травень 2026): ЗАГЛУШКА
// Валідує payload, логує в console, повертає 200 OK.
// Telegram webhook і Supabase — технічний борг, ітерація 2.
//
// TODO (ітерація 2):
//   - INSERT в Supabase таблицю oxfordmed_leads
//   - Telegram Bot API → TELEGRAM_BOT_TOKEN_OXFORDMED + TELEGRAM_CHAT_ID_OXFORDMED
//   - Аналог повної логіки onclinic.js

const SERVICE_MAP = {
  'gisteroskopia': {
    searchName:   'Гістероскопія',
    officialName: [
      'Діагностична (офісна) гістероскопія — 14 500 грн [PLACEHOLDER]',
      'Гістерорезектоскопія з поліпектомією — 18 500 грн [PLACEHOLDER]',
    ],
    price: 'від 14 500 грн [PLACEHOLDER]',
  },
  'peredna-kolporafia': {
    searchName:   'Передня кольпорафія',
    officialName: 'Передня кольпорафія — 18 000 грн [PLACEHOLDER]',
    price:        'від 18 000 грн [PLACEHOLDER]',
  },
  'zadnya-kolporafia': {
    searchName:   'Задня кольпорафія',
    officialName: 'Задня кольпорафія — 18 000 грн [PLACEHOLDER]',
    price:        'від 18 000 грн [PLACEHOLDER]',
  },
  'sakrospinalna-fiksaciya': {
    searchName:   'Сакроспінальна фіксація',
    officialName: 'Сакроспінальна фіксація — 32 000 грн [PLACEHOLDER]',
    price:        'від 32 000 грн [PLACEHOLDER]',
  },
  'kupolopeksia': {
    searchName:   'Куполопексія',
    officialName: 'Куполопексія (кольпопексія) — 28 000 грн [PLACEHOLDER]',
    price:        'від 28 000 грн [PLACEHOLDER]',
  },
  'vaginalna-gisterektomiya': {
    searchName:   'Вагінальна гістеректомія',
    officialName: 'Вагінальна гістеректомія — 35 000 грн [PLACEHOLDER]',
    price:        'від 35 000 грн [PLACEHOLDER]',
  },
  'consultation': {
    searchName:   'Консультація гінеколога-хірурга',
    officialName: 'Консультація гінеколога-хірурга',
    price:        'від 1 050 грн',
  },
};

const DOCTOR_MAP = {
  klimpush: 'Климпуш Д.Л. (консультація від 1 050 грн)',
  tkachuk:  'Ткачук Л.Л. (консультація від 1 350 грн)',
  tokar:    'Токар К.С. (консультація від 1 050 грн)',
};

const CONTACT_LABELS = { call: 'Дзвінок', telegram: 'Telegram', viber: 'Viber' };

function buildLogMessage(record) {
  const lines = [];
  lines.push('=== [oxfordmed-leads] НОВИЙ ЛІД ===');
  lines.push(`Час: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`);
  lines.push(`Ім'я: ${record.name}`);
  lines.push(`Телефон: ${record.phone}`);
  lines.push(`Зв'язок: ${CONTACT_LABELS[record.contact_method] || record.contact_method || '—'}`);
  if (record.case_slug && SERVICE_MAP[record.case_slug]) {
    const svc = SERVICE_MAP[record.case_slug];
    lines.push(`Послуга: ${svc.searchName} (${svc.price})`);
  } else if (record.case_slug) {
    lines.push(`Послуга: ${record.case_slug}`);
  } else {
    lines.push('Послуга: Загальна консультація');
  }
  if (record.preferred_doctor) {
    lines.push(`Лікар: ${DOCTOR_MAP[record.preferred_doctor] || record.preferred_doctor}`);
  }
  lines.push(`CTA: ${record.source_cta || '—'}`);
  lines.push(`Сторінка: ${record.source_page || '—'}`);
  lines.push('=== TODO: підключити Supabase + Telegram webhook (ітерація 2) ===');
  return lines.join('\n');
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};

  // ── Honeypot ───────────────────────────────────────────────────────────────
  if (body.website) {
    return res.status(200).json({ ok: true, leadId: null }); // silent reject
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  if (!body.name || body.name.trim().length < 2)
    return res.status(400).json({ error: "Ім'я занадто коротке" });

  const phoneDigits = (body.phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 10)
    return res.status(400).json({ error: 'Некоректний телефон' });

  if (body.consent_given !== true)
    return res.status(400).json({ error: 'Потрібна згода' });

  // ── Phone normalization ────────────────────────────────────────────────────
  let phone = phoneDigits;
  if (phone.startsWith('0')) phone = '38' + phone;
  if (!phone.startsWith('380')) phone = '380' + phone.slice(-9);
  phone = '+' + phone;

  // ── Build record ───────────────────────────────────────────────────────────
  const record = {
    name:             body.name.trim(),
    phone,
    contact_method:   body.contact_method    || null,
    case_slug:        body.case_slug         || null,
    preferred_doctor: body.preferred_doctor  || null,
    source_page:      body.source_page       || null,
    source_cta:       body.source_cta        || null,
    other_purpose:    body.other_purpose     || null,
    utm_source:       body.utm_source        || null,
    utm_medium:       body.utm_medium        || null,
    utm_campaign:     body.utm_campaign      || null,
    consent_given:    true,
    clinic:           'oxford-med-lviv',
    branch:           'rappaporta',
    created_at:       new Date().toISOString(),
  };

  // ── Log (замість Supabase — тимчасово) ────────────────────────────────────
  console.log(buildLogMessage(record));
  console.log('[oxfordmed-leads] Full payload:', JSON.stringify(record, null, 2));

  // ── TODO: Supabase INSERT ──────────────────────────────────────────────────
  // const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // await fetch(`${SUPABASE_URL}/rest/v1/oxfordmed_leads`, { method: 'POST', ... });

  // ── TODO: Telegram webhook ─────────────────────────────────────────────────
  // const token  = process.env.TELEGRAM_BOT_TOKEN_OXFORDMED;
  // const chatId = process.env.TELEGRAM_CHAT_ID_OXFORDMED;
  // await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { ... });

  // ── Respond ────────────────────────────────────────────────────────────────
  res.status(200).json({ ok: true, leadId: null, note: 'stub — ітерація 2 підключить Supabase і Telegram' });
};
