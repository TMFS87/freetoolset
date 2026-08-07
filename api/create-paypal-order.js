/**
 * Vercel Serverless Function — Create PayPal Order
 * Creates a PayPal checkout order (card / PayPal balance) for purchasing credits.
 * Mirrors create-payment.js (NOWPayments) but uses PayPal REST API.
 *
 * POST body: { pack: '100'|'500'|'1500', userId: string }
 * Returns:  { success, orderID, clientId }  (clientId is public, used to load PayPal JS SDK)
 */

/* ==================== Config ==================== */

const CREDIT_PACKS = {
  '100': { credits: 100, price: 4.99, label: '100 Credits' },
  '500': { credits: 500, price: 19.99, label: '500 Credits' },
  '1500': { credits: 1500, price: 49.99, label: '1500 Credits' }
};

const SUCCESS_URL = 'https://www.freetoolset.app/ai-studio.html?payment=success';
const CANCEL_URL = 'https://www.freetoolset.app/ai-studio.html?payment=cancel';

function paypalBase() {
  var mode = (process.env.PAYPAL_MODE || 'live').toLowerCase();
  return mode === 'sandbox' ? 'https://api.sandbox.paypal.com' : 'https://api.paypal.com';
}

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

function getRedisUrl() { return process.env.KV_REST_API_URL || ''; }
function getRedisToken() { return process.env.KV_REST_API_TOKEN || ''; }
function redisHeaders() {
  return { 'Authorization': 'Bearer ' + getRedisToken(), 'Content-Type': 'application/json' };
}
async function redisSet(key, value) {
  var url = getRedisUrl() + '/set/' + encodeURIComponent(key) + '/' + encodeURIComponent(value);
  var resp = await fetch(url, { method: 'POST', headers: redisHeaders() });
  return resp.ok;
}

/* ==================== PayPal Auth ==================== */

async function getPayPalToken() {
  var clientId = process.env.PAYPAL_CLIENT_ID;
  var secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) return null;
  var auth = Buffer.from(clientId + ':' + secret).toString('base64');
  var resp = await fetch(paypalBase() + '/v1/oauth2/token', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + auth, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  if (!resp.ok) return null;
  var data = await resp.json();
  return data.access_token || null;
}

/* ==================== Handler ==================== */

module.exports = async function (req, res) {
  var corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') { res.writeHead(204, corsHeaders); res.end(); return; }
  if (req.method !== 'POST') {
    res.writeHead(405, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }));
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

  var pack = body.pack;
  var userId = body.userId;

  if (!userId) {
    res.writeHead(400, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Missing userId.' }));
    return;
  }
  if (!pack || !CREDIT_PACKS[String(pack)]) {
    res.writeHead(400, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Invalid credit pack.' }));
    return;
  }

  // PayPal not configured?
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'PayPal is not configured yet. Please use crypto payment for now.' }));
    return;
  }
  if (!getRedisUrl() || !getRedisToken()) {
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Service is not fully configured. Please try again later.' }));
    return;
  }

  var packInfo = CREDIT_PACKS[String(pack)];
  var token = await getPayPalToken();
  if (!token) {
    res.writeHead(502, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Failed to authenticate with PayPal.' }));
    return;
  }

  var timestamp = Date.now();
  var internalOrderId = 'ftpay_' + userId + '_' + timestamp;

  try {
    var createResp = await fetch(paypalBase() + '/v2/checkout/orders', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: 'USD', value: packInfo.price.toFixed(2) },
          custom_id: internalOrderId,
          description: 'FreeToolset ' + packInfo.label
        }],
        application_context: { return_url: SUCCESS_URL, cancel_url: CANCEL_URL, brand_name: 'FreeToolset' }
      })
    });

    if (!createResp.ok) {
      var errText = await createResp.text();
      console.error('PayPal create order error:', createResp.status, errText);
      res.writeHead(502, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Failed to create PayPal order.' }));
      return;
    }

    var order = await createResp.json();
    var paypalOrderId = order.id;

    // Extract approval URL for redirect-based checkout (no JS SDK needed)
    var approvalUrl = '';
    if (order.links && Array.isArray(order.links)) {
      for (var li = 0; li < order.links.length; li++) {
        if (order.links[li].rel === 'approve') { approvalUrl = order.links[li].href; break; }
      }
    }

    // Store mapping in Redis
    var orderInfo = {
      internalOrderId: internalOrderId,
      paypalOrderId: paypalOrderId,
      userId: userId,
      pack: String(pack),
      credits: packInfo.credits,
      price: packInfo.price,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    await redisSet('ft:payment_paypal:' + paypalOrderId, JSON.stringify(orderInfo));

    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      success: true,
      orderID: paypalOrderId,
      approvalUrl: approvalUrl,
      mode: (process.env.PAYPAL_MODE || 'live').toLowerCase()
    }));
  } catch (error) {
    console.error('Create PayPal order error:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'An unexpected error occurred.' }));
  }
};
