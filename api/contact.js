/**
 * Vercel Serverless Function — Contact form submission storage.
 *
 * POST — Saves a contact message to Upstash Redis (list `ft:contacts`).
 * Body: { name, email, subject, message }
 *
 * The site is privacy-first: messages are intentionally submitted (the user
 * opts in by filling the form). They are stored server-side so the owner can
 * actually read them — unlike a pure mailto: link that goes nowhere when no
 * mail client is configured.
 */

/* ==================== CORS ==================== */

const ALLOWED_ORIGINS = ['https://www.freetoolset.app', 'https://freetoolset.app'];

function getCorsHeaders(req) {
  var origin = req.headers && req.headers.origin ? req.headers.origin : '';
  var allowOrigin = ALLOWED_ORIGINS.indexOf(origin) !== -1 ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  };
}

/* ==================== Redis Helpers ==================== */

function getRedisUrl() {
  return process.env.KV_REST_API_URL || '';
}

function getRedisToken() {
  return process.env.KV_REST_API_TOKEN || '';
}

function redisHeaders() {
  return {
    'Authorization': 'Bearer ' + getRedisToken(),
    'Content-Type': 'application/json'
  };
}

async function redisLpush(key, value) {
  var url = getRedisUrl() + '/lpush/' + encodeURIComponent(key) + '/' + encodeURIComponent(value);
  var resp = await fetch(url, { method: 'POST', headers: redisHeaders() });
  return resp.ok;
}

/* ==================== Handler ==================== */

module.exports = async function (req, res) {
  var corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }));
    return;
  }

  if (!getRedisUrl() || !getRedisToken()) {
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Service is not configured.' }));
    return;
  }

  var body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    res.writeHead(400, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Invalid request body.' }));
    return;
  }

  var name = (body.name || '').toString().trim();
  var email = (body.email || '').toString().trim();
  var subject = (body.subject || '').toString().trim();
  var message = (body.message || '').toString().trim();

  if (!name || !email || !message) {
    res.writeHead(400, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Name, email and message are required.' }));
    return;
  }

  // Basic email shape check (not exhaustive, just guards against garbage).
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.writeHead(400, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Please enter a valid email address.' }));
    return;
  }

  var record = {
    id: 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    receivedAt: new Date().toISOString(),
    name: name,
    email: email,
    subject: subject || 'General Feedback',
    message: message
  };

  try {
    var ok = await redisLpush('ft:contacts', JSON.stringify(record));
    if (!ok) {
      res.writeHead(500, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Failed to store message.' }));
      return;
    }
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({ success: true, id: record.id }));
  } catch (err) {
    console.error('Contact save error:', err);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Unexpected error. Please try again.' }));
  }
};
