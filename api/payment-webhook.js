/**
 * Vercel Serverless Function — NOWPayments IPN Webhook Handler
 * Receives payment status notifications from NOWPayments.
 * Verifies HMAC-SHA512 signature, then credits user upon confirmed payment.
 * POST request from NOWPayments servers.
 */

const crypto = require('crypto');

/* ==================== Config ==================== */

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

/* ==================== CORS ==================== */

// Webhook endpoints don't need strict CORS (called server-to-server),
// but we include headers for potential browser checks.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

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

/* ==================== IPN Signature Verification ==================== */

/**
 * Verify NOWPayments IPN signature.
 * NOWPayments sends x-nowpayments-sig header which is the HMAC-SHA512
 * of the sorted JSON body string, using the IPN secret key.
 * 
 * The signature is computed on the JSON.stringify() of the parsed body
 * with sorted keys. NOWPayments sorts parameters alphabetically.
 */
function verifyIpnSignature(body, signature, ipnKey) {
  if (!signature || !ipnKey) return false;

  try {
    // Sort the body object keys alphabetically and re-stringify
    var sortedBody = JSON.stringify(sortObjectKeys(body));
    var hmac = crypto.createHmac('sha512', ipnKey);
    hmac.update(sortedBody);
    var computed = hmac.digest('hex');
    return computed === signature;
  } catch (e) {
    console.error('IPN signature verification error:', e);
    return false;
  }
}

function sortObjectKeys(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  var sorted = {};
  var keys = Object.keys(obj).sort();
  for (var i = 0; i < keys.length; i++) {
    sorted[keys[i]] = sortObjectKeys(obj[keys[i]]);
  }
  return sorted;
}

// Paid credits stored as array of batches { points, purchasedAt, expiresAt }.
// expiresAt === null => permanent (legacy balance). New purchases expire in 60 days.
const CREDIT_EXPIRY_DAYS = 60;
const CREDIT_EXPIRY_MS = CREDIT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

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

/* ==================== Payment Log ==================== */

async function addPaymentLog(userId, logEntry) {
  var logKey = 'ft:payment_log:' + userId;
  var existing = await redisGet(logKey);
  var logs = [];
  if (existing) {
    try { logs = JSON.parse(existing); } catch (e) { logs = []; }
  }
  logs.unshift(logEntry);
  if (logs.length > 100) {
    logs = logs.slice(0, 100);
  }
  await redisSet(logKey, JSON.stringify(logs));
}

/* ==================== Handler ==================== */

module.exports = async function (req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.writeHead(405, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Method not allowed.' }));
    return;
  }

  var ipnKey = process.env.NOWPAYMENTS_IPN_KEY;
  if (!ipnKey) {
    console.error('NOWPAYMENTS_IPN_KEY not configured');
    res.writeHead(500, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Webhook not configured.' }));
    return;
  }

  // Check Redis configuration
  if (!getRedisUrl() || !getRedisToken()) {
    console.error('Redis not configured for webhook');
    res.writeHead(500, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Service not configured.' }));
    return;
  }

  // Parse body — need raw body for signature verification
  var body;
  var rawBody;
  try {
    if (typeof req.body === 'string') {
      rawBody = req.body;
      body = JSON.parse(req.body);
    } else if (req.body) {
      body = req.body;
      rawBody = JSON.stringify(req.body);
    } else {
      // No body provided
      res.writeHead(400, CORS_HEADERS);
      res.end(JSON.stringify({ success: false, error: 'Empty body.' }));
      return;
    }
  } catch (e) {
    res.writeHead(400, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Invalid JSON body.' }));
    return;
  }

  // Get signature from header
  var signature = req.headers['x-nowpayments-sig'] || '';

  // Verify signature
  var isVerified = verifyIpnSignature(body, signature, ipnKey);
  if (!isVerified) {
    console.error('IPN signature verification failed');
    res.writeHead(403, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Invalid signature.' }));
    return;
  }

  // Extract payment status
  var paymentStatus = body.payment_status || '';
  var orderId = body.order_id || '';
  var paymentId = body.payment_id || null;

  // Only process confirmed/finished payments
  if (paymentStatus !== 'finished' && paymentStatus !== 'confirmed') {
    // Not a completion notification — acknowledge but don't process
    res.writeHead(200, CORS_HEADERS);
    res.end(JSON.stringify({ success: true, message: 'Payment status: ' + paymentStatus + '. No action needed.' }));
    return;
  }

  // Read order from Redis
  if (!orderId) {
    console.error('No order_id in IPN notification');
    res.writeHead(400, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Missing order_id.' }));
    return;
  }

  var orderStr = await redisGet('ft:payment:' + orderId);
  if (!orderStr) {
    console.error('Order not found:', orderId);
    res.writeHead(404, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Order not found.' }));
    return;
  }

  var order;
  try {
    order = JSON.parse(orderStr);
  } catch (e) {
    console.error('Failed to parse order data:', orderId);
    res.writeHead(500, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Corrupted order data.' }));
    return;
  }

  // Check if already completed (idempotency)
  if (order.status === 'completed') {
    console.log('Order already completed:', orderId);
    res.writeHead(200, CORS_HEADERS);
    res.end(JSON.stringify({ success: true, message: 'Order already processed.' }));
    return;
  }

  var userId = order.userId;
  var credits = order.credits;

  // Convert credits to points (1 credit = 10 points)
  var pointsToAdd = credits * 10;

  // Add points to user's paid balance as a new (expiring) batch
  var batches = await getPaidBatches(userId);
  var now = Date.now();
  var expiresAt = new Date(now + CREDIT_EXPIRY_MS).toISOString();
  batches.push({ points: pointsToAdd, purchasedAt: new Date(now).toISOString(), expiresAt: expiresAt });
  await setPaidBatches(userId, batches);

  // Update order status
  order.status = 'completed';
  order.completedAt = new Date().toISOString();
  order.paymentId = paymentId;
  order.payAmount = body.pay_amount || null;
  order.payCurrency = body.pay_currency || null;
  await redisSet('ft:payment:' + orderId, JSON.stringify(order));

  // Record payment log
  await addPaymentLog(userId, {
    timestamp: new Date().toISOString(),
    orderId: orderId,
    paymentId: paymentId,
    pack: order.pack,
    credits: credits,
    price: order.price,
    status: 'completed',
    payAmount: body.pay_amount || null,
    payCurrency: body.pay_currency || null
  });

  console.log('Payment completed:', orderId, 'User:', userId, 'Credits:', credits);

  res.writeHead(200, CORS_HEADERS);
  res.end(JSON.stringify({ success: true, message: 'Payment processed successfully.' }));
};
