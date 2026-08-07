/**
 * Vercel Serverless Function — PayPal Capture & Credit
 * Called by the frontend after the user approves a PayPal payment.
 * Server-side captures the order, verifies completion + amount, then credits
 * the user's account (same logic as payment-webhook.js for NOWPayments).
 *
 * POST body: { orderID: string, userId: string }
 * Returns:  { success, message }
 */

/* ==================== Config ==================== */

function paypalBase() {
  var mode = (process.env.PAYPAL_MODE || 'live').toLowerCase();
  return mode === 'sandbox' ? 'https://api.sandbox.paypal.com' : 'https://api.paypal.com';
}

const CREDIT_EXPIRY_DAYS = 60;
const CREDIT_EXPIRY_MS = CREDIT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

/* ==================== CORS ==================== */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

/* ==================== Redis Helpers ==================== */

function getRedisUrl() { return process.env.KV_REST_API_URL || ''; }
function getRedisToken() { return process.env.KV_REST_API_TOKEN || ''; }
function redisHeaders() {
  return { 'Authorization': 'Bearer ' + getRedisToken(), 'Content-Type': 'application/json' };
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

/* ==================== Credit Helpers (mirrors payment-webhook.js) ==================== */

async function getPaidBatches(userId) {
  var str = await redisGet('ft:paid:' + userId);
  if (!str) return [];
  try {
    var parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && parsed.batches && Array.isArray(parsed.batches)) return parsed.batches;
    if (typeof parsed === 'number' && parsed > 0) return [{ points: parsed, purchasedAt: null, expiresAt: null }];
    return [];
  } catch (e) {
    var n = parseInt(str, 10);
    if (!isNaN(n) && n > 0) return [{ points: n, purchasedAt: null, expiresAt: null }];
    return [];
  }
}
async function setPaidBatches(userId, batches) {
  var cleaned = batches.filter(function (b) { return b.points > 0; });
  await redisSet('ft:paid:' + userId, JSON.stringify(cleaned));
}
async function addPaymentLog(userId, logEntry) {
  var logKey = 'ft:payment_log:' + userId;
  var existing = await redisGet(logKey);
  var logs = [];
  if (existing) { try { logs = JSON.parse(existing); } catch (e) { logs = []; } }
  logs.unshift(logEntry);
  if (logs.length > 100) logs = logs.slice(0, 100);
  await redisSet(logKey, JSON.stringify(logs));
}

/* ==================== Handler ==================== */

module.exports = async function (req, res) {
  if (req.method === 'OPTIONS') { res.writeHead(204, CORS_HEADERS); res.end(); return; }
  if (req.method !== 'POST') {
    res.writeHead(405, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Method not allowed.' }));
    return;
  }

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    res.writeHead(500, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'PayPal not configured.' }));
    return;
  }
  if (!getRedisUrl() || !getRedisToken()) {
    res.writeHead(500, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Service not configured.' }));
    return;
  }

  var body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    res.writeHead(400, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Invalid JSON body.' }));
    return;
  }

  var orderID = body.orderID;
  var userId = body.userId;
  if (!orderID || !userId) {
    res.writeHead(400, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Missing orderID or userId.' }));
    return;
  }

  // Idempotency: already processed?
  var orderStr = await redisGet('ft:payment_paypal:' + orderID);
  if (!orderStr) {
    res.writeHead(404, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Order not found.' }));
    return;
  }
  var order;
  try { order = JSON.parse(orderStr); } catch (e) {
    res.writeHead(500, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Corrupted order data.' }));
    return;
  }
  if (order.status === 'completed') {
    res.writeHead(200, CORS_HEADERS);
    res.end(JSON.stringify({ success: true, message: 'Order already processed.' }));
    return;
  }

  var token = await getPayPalToken();
  if (!token) {
    res.writeHead(502, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Failed to authenticate with PayPal.' }));
    return;
  }

  try {
    // Capture the order server-side
    var captureResp = await fetch(paypalBase() + '/v2/checkout/orders/' + encodeURIComponent(orderID) + '/capture', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: '{}'
    });
    if (!captureResp.ok) {
      var capErr = await captureResp.text();
      console.error('PayPal capture error:', captureResp.status, capErr);
      res.writeHead(502, CORS_HEADERS);
      res.end(JSON.stringify({ success: false, error: 'Failed to capture PayPal payment.' }));
      return;
    }
    var captureResult = await captureResp.json();

    // Verify completion
    var status = captureResult.status || (captureResult.purchase_units && captureResult.purchase_units[0] && captureResult.purchase_units[0].payments && captureResult.purchase_units[0].payments.captures && captureResult.purchase_units[0].payments.captures[0] && captureResult.purchase_units[0].payments.captures[0].status);
    if (status !== 'COMPLETED') {
      console.error('PayPal order not completed:', status);
      res.writeHead(402, CORS_HEADERS);
      res.end(JSON.stringify({ success: false, error: 'Payment not completed.' }));
      return;
    }

    // Credit the user
    var credits = order.credits;
    var pointsToAdd = credits * 10;
    var batches = await getPaidBatches(userId);
    var now = Date.now();
    var expiresAt = new Date(now + CREDIT_EXPIRY_MS).toISOString();
    batches.push({ points: pointsToAdd, purchasedAt: new Date(now).toISOString(), expiresAt: expiresAt });
    await setPaidBatches(userId, batches);

    // Mark order completed
    order.status = 'completed';
    order.completedAt = new Date().toISOString();
    await redisSet('ft:payment_paypal:' + orderID, JSON.stringify(order));

    await addPaymentLog(userId, {
      timestamp: new Date().toISOString(),
      orderId: orderID,
      internalOrderId: order.internalOrderId,
      pack: order.pack,
      credits: credits,
      price: order.price,
      method: 'paypal',
      status: 'completed'
    });

    console.log('PayPal payment completed:', orderID, 'User:', userId, 'Credits:', credits);

    res.writeHead(200, CORS_HEADERS);
    res.end(JSON.stringify({ success: true, message: 'Payment processed successfully.' }));
  } catch (error) {
    console.error('PayPal capture handler error:', error);
    res.writeHead(500, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'An unexpected error occurred.' }));
  }
};
