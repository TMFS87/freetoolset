/**
 * Vercel Serverless Function — Create NOWPayments Invoice
 * Creates a crypto payment invoice for purchasing credits.
 * POST request with body: { pack: '100'|'500'|'1500', userId: string }
 */

/* ==================== Config ==================== */

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';
const SUCCESS_URL = 'https://www.freetoolset.app/ai-studio.html?payment=success';
const CANCEL_URL = 'https://www.freetoolset.app/ai-studio.html?payment=cancel';
const IPN_CALLBACK_URL = 'https://www.freetoolset.app/api/payment-webhook';

// Credit pack definitions: pack -> { credits, price, label }
const CREDIT_PACKS = {
  '100': { credits: 100, price: 4.99, label: '100 Credits' },
  '500': { credits: 500, price: 19.99, label: '500 Credits' },
  '1500': { credits: 1500, price: 49.99, label: '1500 Credits' }
};

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

async function redisGet(key) {
  var url = getRedisUrl() + '/get/' + encodeURIComponent(key);
  var resp = await fetch(url, { headers: redisHeaders() });
  if (!resp.ok) return null;
  var data = await resp.json();
  if (data.result === null || data.result === undefined) return null;
  return data.result;
}

async function redisSet(key, value) {
  var url = getRedisUrl() + '/set/' + encodeURIComponent(key) + '/' + encodeURIComponent(value);
  var resp = await fetch(url, { method: 'POST', headers: redisHeaders() });
  return resp.ok;
}

/* ==================== Handler ==================== */

module.exports = async function (req, res) {
  var corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.writeHead(405, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }));
    return;
  }

  // Parse request body
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

  // Validate userId
  if (!userId) {
    res.writeHead(400, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Missing userId.' }));
    return;
  }

  // Validate pack
  if (!pack || !CREDIT_PACKS[String(pack)]) {
    res.writeHead(400, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Invalid credit pack. Choose from: 100, 500, or 1500.' }));
    return;
  }

  var packInfo = CREDIT_PACKS[String(pack)];

  // Check NOWPayments API key
  var apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) {
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Payment service is not configured. Please try again later.' }));
    return;
  }

  // Check Redis configuration
  if (!getRedisUrl() || !getRedisToken()) {
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Service is not fully configured. Please try again later.' }));
    return;
  }

  // Generate order ID
  var timestamp = Date.now();
  var orderId = 'ft_' + userId + '_' + timestamp;

  // Create NOWPayments invoice
  try {
    var invoiceBody = {
      price_amount: packInfo.price,
      price_currency: 'usd',
      order_id: orderId,
      order_description: 'FreeToolset ' + packInfo.label,
      ipn_callback_url: IPN_CALLBACK_URL,
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL
    };

    var response = await fetch(NOWPAYMENTS_API_URL + '/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoiceBody)
    });

    if (!response.ok) {
      var errText = await response.text();
      console.error('NOWPayments API error:', response.status, errText);
      res.writeHead(502, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Failed to create payment invoice. Please try again later.' }));
      return;
    }

    var invoiceResult = await response.json();

    // Store order info in Redis
    var orderInfo = {
      userId: userId,
      pack: String(pack),
      credits: packInfo.credits,
      price: packInfo.price,
      status: 'pending',
      createdAt: new Date().toISOString(),
      invoiceId: invoiceResult.id || null
    };

    await redisSet('ft:payment:' + orderId, JSON.stringify(orderInfo));

    // Return invoice URL to frontend
    var invoiceUrl = invoiceResult.invoice_url || (invoiceResult.url || null);

    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      success: true,
      data: {
        orderId: orderId,
        invoiceId: invoiceResult.id || null,
        invoiceUrl: invoiceUrl,
        price: packInfo.price,
        credits: packInfo.credits
      }
    }));
  } catch (error) {
    console.error('Create payment error:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'An unexpected error occurred while creating the payment.' }));
  }
};
