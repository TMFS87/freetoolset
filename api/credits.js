/**
 * Vercel Serverless Function — Credits Management API
 * GET  — Returns current credit balance (free + paid) and usage history.
 *         Query param: ?userId=xxx
 * POST — Perform credit actions (redeem access code, get history).
 *         Body: { userId: string, action: 'redeem'|'history', code?: string }
 */

/* ==================== Config ==================== */

const FREE_DAILY_POINTS = 50;  // 5 credits/day for free users

/* ==================== CORS ==================== */

const ALLOWED_ORIGINS = ['https://www.freetoolset.app', 'https://freetoolset.app'];

function getCorsHeaders(req) {
  var origin = req.headers && req.headers.origin ? req.headers.origin : '';
  var allowOrigin = ALLOWED_ORIGINS.indexOf(origin) !== -1 ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

/* ==================== Date Helper ==================== */

function getDateStr() {
  var d = new Date();
  var y = d.getUTCFullYear();
  var m = String(d.getUTCMonth() + 1).padStart(2, '0');
  var day = String(d.getUTCDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

/* ==================== Paid Batch Helpers ==================== */

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

function getValidBatches(batches, now) {
  return batches.filter(function (b) { return b.expiresAt === null || new Date(b.expiresAt).getTime() > now; });
}

function paidBalanceFromBatches(batches) {
  return batches.reduce(function (s, b) { return s + b.points; }, 0);
}

function earliestExpiryFromBatches(batches) {
  var min = null;
  batches.forEach(function (b) {
    if (b.expiresAt !== null) {
      var t = new Date(b.expiresAt).getTime();
      if (min === null || t < min) min = t;
    }
  });
  return min;
}

/* ==================== Get Credits Info ==================== */

async function getCreditsInfo(userId) {
  var dateKey = getDateStr();
  var freeKey = 'ft:free:' + userId + ':' + dateKey;
  var usageKey = 'ft:usage:' + userId;

  // Free usage today
  var freeUsedStr = await redisGet(freeKey);
  var freeUsed = freeUsedStr ? parseInt(freeUsedStr, 10) : 0;
  var freeRemaining = Math.max(0, FREE_DAILY_POINTS - freeUsed);

  // Paid balance (valid, non-expired batches only)
  var batches = await getPaidBatches(userId);
  var now = Date.now();
  var valid = getValidBatches(batches, now);
  var paidBalance = paidBalanceFromBatches(valid);
  var earliestExpiry = earliestExpiryFromBatches(valid);

  // Usage history
  var usageStr = await redisGet(usageKey);
  var usageHistory = [];
  if (usageStr) {
    try { usageHistory = JSON.parse(usageStr); } catch (e) { usageHistory = []; }
  }

  var totalPoints = freeRemaining + paidBalance;

  return {
    freeCredits: freeRemaining / 10,
    freeCreditsUsed: freeUsed / 10,
    freeCreditsLimit: FREE_DAILY_POINTS / 10,
    paidCredits: paidBalance / 10,
    totalCredits: totalPoints / 10,
    paidExpiresAt: earliestExpiry ? new Date(earliestExpiry).toISOString() : null,
    usageHistory: usageHistory
  };
}

/* ==================== Redeem Access Code ==================== */

async function redeemAccessCode(userId, code) {
  if (!code || !code.trim()) {
    return { success: false, error: 'Access code is required.' };
  }

  var normalizedCode = code.trim();
  var codeKey = 'ft:code:' + normalizedCode;

  // Check if code exists and is valid
  var codeStr = await redisGet(codeKey);
  if (!codeStr) {
    return { success: false, error: 'Invalid or expired access code.' };
  }

  var codeInfo;
  try {
    codeInfo = JSON.parse(codeStr);
  } catch (e) {
    return { success: false, error: 'Corrupted access code data.' };
  }

  // Check if already redeemed
  if (codeInfo.status === 'redeemed') {
    return { success: false, error: 'This access code has already been redeemed.' };
  }

  // Redeem the code
  codeInfo.status = 'redeemed';
  codeInfo.redeemedBy = userId;
  codeInfo.redeemedAt = new Date().toISOString();
  await redisSet(codeKey, JSON.stringify(codeInfo));

  // Add credits to user's paid balance as a new (expiring) batch
  var pointsToAdd = codeInfo.credits * 10;
  var batches = await getPaidBatches(userId);
  var now = Date.now();
  var expiresAt = new Date(now + CREDIT_EXPIRY_MS).toISOString();
  batches.push({ points: pointsToAdd, purchasedAt: new Date(now).toISOString(), expiresAt: expiresAt });
  await setPaidBatches(userId, batches);

  // Record in payment log
  var logKey = 'ft:payment_log:' + userId;
  var existingLogs = await redisGet(logKey);
  var logs = [];
  if (existingLogs) {
    try { logs = JSON.parse(existingLogs); } catch (e) { logs = []; }
  }
  logs.unshift({
    timestamp: new Date().toISOString(),
    type: 'redeem',
    credits: codeInfo.credits,
    code: normalizedCode
  });
  if (logs.length > 100) logs = logs.slice(0, 100);
  await redisSet(logKey, JSON.stringify(logs));

  return {
    success: true,
    creditsAdded: codeInfo.credits,
    newPaidCredits: newPaidBalance / 10
  };
}

/* ==================== Get Payment History ==================== */

async function getPaymentHistory(userId) {
  var logKey = 'ft:payment_log:' + userId;
  var logStr = await redisGet(logKey);
  if (!logStr) return [];
  try {
    return JSON.parse(logStr);
  } catch (e) {
    return [];
  }
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

  // Check Redis configuration
  if (!getRedisUrl() || !getRedisToken()) {
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Service is not configured. Please try again later.' }));
    return;
  }

  // GET request — return credits info
  if (req.method === 'GET') {
    var query = req.query || {};
    var userId = query.userId;

    if (!userId) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Missing userId parameter.' }));
      return;
    }

    try {
      var info = await getCreditsInfo(userId);
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        data: info
      }));
    } catch (error) {
      console.error('Credits GET error:', error);
      res.writeHead(500, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Failed to retrieve credits information.' }));
    }
    return;
  }

  // POST request — perform actions
  if (req.method === 'POST') {
    var body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    } catch (e) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Invalid request body.' }));
      return;
    }

    var userId = body.userId;
    var action = body.action;

    if (!userId) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Missing userId.' }));
      return;
    }

    if (!action) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Missing action parameter.' }));
      return;
    }

    try {
      if (action === 'redeem') {
        var result = await redeemAccessCode(userId, body.code);
        if (result.success) {
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify({
            success: true,
            data: {
              creditsAdded: result.creditsAdded,
              newPaidCredits: result.newPaidCredits
            }
          }));
        } else {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({ success: false, error: result.error }));
        }
      } else if (action === 'history') {
        var history = await getPaymentHistory(userId);
        var currentInfo = await getCreditsInfo(userId);
        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({
          success: true,
          data: {
            credits: {
              freeCredits: currentInfo.freeCredits,
              paidCredits: currentInfo.paidCredits,
              totalCredits: currentInfo.totalCredits
            },
            paymentHistory: history,
            usageHistory: currentInfo.usageHistory
          }
        }));
      } else {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ success: false, error: 'Unknown action. Use: redeem or history.' }));
      }
    } catch (error) {
      console.error('Credits POST error:', error);
      res.writeHead(500, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'An unexpected error occurred.' }));
    }
    return;
  }

  // Other methods not allowed
  res.writeHead(405, corsHeaders);
  res.end(JSON.stringify({ success: false, error: 'Method not allowed. Use GET or POST.' }));
};
