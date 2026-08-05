/**
 * Vercel Serverless Function — AI Proxy for FreeToolset
 * Core backend supporting:
 *   Mode A — 5 templated AI tools (product-description, seo-meta, blog-writer, email-subject, content-rewriter)
 *   Mode B — AI Studio free-form chat (OpenAI-style messages array)
 * Includes credits/points system with daily free quota + paid balance via Upstash Redis.
 */

/* ==================== Config ==================== */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';
const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const GLM_MODEL = 'glm-4-flash';
const GLM_VISION_MODEL = 'glm-4v';
const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt/';

// Credits config: 1 credit = 10 points
const FREE_DAILY_POINTS = 50;       // 5 credits/day for free users
const GLM_COST_POINTS = 5;           // 0.5 credits per GLM call
const DEEPSEEK_COST_POINTS = 10;    // 1 credit per DeepSeek call
const IMAGE_GEN_COST_POINTS = 10;   // 1 credit per image generation
const VISION_COST_POINTS = 10;      // 1 credit per image recognition
const MAX_USAGE_RECORDS = 50;

/* ==================== Prompt Templates (Mode A) ==================== */

const PROMPT_TEMPLATES = {
  'product-description': function (d) {
    return 'You are an expert e-commerce copywriter. Write a compelling, conversion-optimized product description. ' +
      'Product: ' + d.productName + '. Key features: ' + d.features + '. ' +
      'Target audience: ' + d.audience + '. Tone: ' + d.tone + '. ' +
      'Write 2-3 paragraphs with a clear hook, benefit-driven features, and a call to action.';
  },
  'seo-meta': function (d) {
    return 'You are an SEO expert. Generate optimized meta tags. ' +
      'Page topic: ' + d.pageTitle + '. Target keywords: ' + d.keywords + '. ' +
      'Content type: ' + d.contentType + '. ' +
      'Return in this exact format:\n' +
      'Meta Title: [under 60 characters]\n' +
      'Meta Description: [under 160 characters]\n\n' +
      'Provide 3 variations.';
  },
  'blog-writer': function (d) {
    return 'You are a professional blog writer. Write a ' + d.length + ' blog post about: ' + d.topic + '. ' +
      'Target keywords: ' + d.keywords + '. Tone: ' + d.tone + '. ' +
      'Structure with clear H2 and H3 headings. Include an engaging intro, informative body, and strong conclusion. ' +
      'Use markdown formatting.';
  },
  'email-subject': function (d) {
    return 'You are an email marketing expert. Generate 10 high-open-rate email subject lines. ' +
      'Topic: ' + d.topic + '. Product/Offer: ' + d.product + '. Target audience: ' + d.audience + '. ' +
      'Mix curiosity, urgency, benefit-driven, and personal styles. Return as a numbered list.';
  },
  'content-rewriter': function (d) {
    return 'You are a professional content rewriter. Rewrite the following text with ' + d.variation +
      ' variation in a ' + d.tone + ' tone. ' +
      'Keep the core meaning but change sentence structure, word choice, and flow. ' +
      'Make it sound natural and engaging.\n\nOriginal text:\n' + d.text;
  }
};

const REQUIRED_FIELDS = {
  'product-description': ['productName', 'features', 'audience', 'tone'],
  'seo-meta': ['pageTitle', 'keywords', 'contentType'],
  'blog-writer': ['topic', 'keywords', 'tone', 'length'],
  'email-subject': ['topic', 'product', 'audience'],
  'content-rewriter': ['text', 'tone', 'variation']
};

const TOOL_LABELS = {
  'product-description': 'Product Description',
  'seo-meta': 'SEO Meta Tags',
  'blog-writer': 'Blog Writer',
  'email-subject': 'Email Subject Lines',
  'content-rewriter': 'Content Rewriter'
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

// GET a key from Redis, returns parsed value or null
async function redisGet(key) {
  var url = getRedisUrl() + '/get/' + encodeURIComponent(key);
  var resp = await fetch(url, { headers: redisHeaders() });
  if (!resp.ok) return null;
  var data = await resp.json();
  if (data.result === null || data.result === undefined) return null;
  return data.result;
}

// SET a key to a string value
async function redisSet(key, value) {
  var url = getRedisUrl() + '/set/' + encodeURIComponent(key) + '/' + encodeURIComponent(value);
  var resp = await fetch(url, { method: 'POST', headers: redisHeaders() });
  return resp.ok;
}

// INCR a key by 1 (for atomic counter)
async function redisIncr(key) {
  var url = getRedisUrl() + '/incr/' + encodeURIComponent(key);
  var resp = await fetch(url, { method: 'POST', headers: redisHeaders() });
  if (!resp.ok) return null;
  var data = await resp.json();
  return data.result;
}

// DECR a key by 1
async function redisDecr(key) {
  var url = getRedisUrl() + '/decr/' + encodeURIComponent(key);
  var resp = await fetch(url, { method: 'POST', headers: redisHeaders() });
  if (!resp.ok) return null;
  var data = await resp.json();
  return data.result;
}

/* ==================== Date Helper ==================== */

function getDateStr() {
  var d = new Date();
  var y = d.getUTCFullYear();
  var m = String(d.getUTCMonth() + 1).padStart(2, '0');
  var day = String(d.getUTCDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

/* ==================== Credits Logic ==================== */

// Paid credits are stored as an array of batches so they can expire.
// Each batch: { points, purchasedAt, expiresAt }
// expiresAt === null means it never expires (legacy balance migrated as-is).
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

function sortBatchesForConsumption(batches) {
  // Earliest-expiring first; null (permanent) consumed last.
  return batches.slice().sort(function (a, b) {
    var ea = a.expiresAt === null ? Infinity : new Date(a.expiresAt).getTime();
    var eb = b.expiresAt === null ? Infinity : new Date(b.expiresAt).getTime();
    return ea - eb;
  });
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

/**
 * Deduct points from user.
 * Strategy: try free daily quota first, then paid balance.
 * Returns { success, error, creditsRemaining }
 */
async function deductPoints(userId, cost) {
  var dateKey = getDateStr();
  var freeKey = 'ft:free:' + userId + ':' + dateKey;

  // Read current free usage
  var freeUsedStr = await redisGet(freeKey);
  var freeUsed = freeUsedStr ? parseInt(freeUsedStr, 10) : 0;
  var freeRemaining = FREE_DAILY_POINTS - freeUsed;

  if (freeRemaining >= cost) {
    // Deduct from free quota
    await redisSet(freeKey, String(freeUsed + cost));
  } else {
    // Partial from free, remainder from valid (non-expired) paid batches
    var fromFree = freeRemaining;
    var fromPaid = cost - fromFree;

    if (fromFree > 0) {
      await redisSet(freeKey, String(freeUsed + fromFree));
    }

    var batches = await getPaidBatches(userId);
    var now = Date.now();
    var valid = getValidBatches(batches, now);
    var validBalance = paidBalanceFromBatches(valid);

    if (validBalance < fromPaid) {
      // Insufficient credits
      var totalRemaining = freeRemaining + validBalance;
      return {
        success: false,
        error: 'Insufficient credits. You need ' + (cost / 10).toFixed(1) + ' credits but only have ' + (totalRemaining / 10).toFixed(1) + ' remaining. Purchase more credits at https://www.freetoolset.app/ai-studio.html',
        creditsRemaining: totalRemaining
      };
    }

    // Deduct from paid batches, earliest-expiring first
    var sorted = sortBatchesForConsumption(valid);
    var remaining = fromPaid;
    for (var i = 0; i < sorted.length; i++) {
      if (remaining <= 0) break;
      var take = Math.min(sorted[i].points, remaining);
      sorted[i].points -= take;
      remaining -= take;
    }
    await setPaidBatches(userId, sorted);
  }

  // Calculate remaining credits
  var finalFreeStr = await redisGet(freeKey);
  var finalFreeUsed = finalFreeStr ? parseInt(finalFreeStr, 10) : 0;
  var finalFreeRemaining = Math.max(0, FREE_DAILY_POINTS - finalFreeUsed);

  var finalBatches = await getPaidBatches(userId);
  var finalValid = getValidBatches(finalBatches, Date.now());
  var finalPaidBalance = paidBalanceFromBatches(finalValid);

  var totalPoints = finalFreeRemaining + finalPaidBalance;
  return {
    success: true,
    creditsRemaining: totalPoints / 10
  };
}

/**
 * Record usage entry in Redis.
 */
async function recordUsage(userId, toolLabel, model, cost) {
  var usageKey = 'ft:usage:' + userId;
  var existing = await redisGet(usageKey);
  var records = [];
  if (existing) {
    try { records = JSON.parse(existing); } catch (e) { records = []; }
  }
  records.unshift({
    timestamp: new Date().toISOString(),
    tool: toolLabel,
    model: model,
    cost: cost / 10
  });
  if (records.length > MAX_USAGE_RECORDS) {
    records = records.slice(0, MAX_USAGE_RECORDS);
  }
  await redisSet(usageKey, JSON.stringify(records));
}

/* ==================== AI Model Call ==================== */

async function callAI(model, messages) {
  var apiUrl, apiKey, modelName;

  if (model === 'glm') {
    apiUrl = GLM_API_URL;
    apiKey = process.env.GLM_API_KEY;
    modelName = GLM_MODEL;
  } else {
    apiUrl = DEEPSEEK_API_URL;
    apiKey = process.env.DEEPSEEK_API_KEY;
    modelName = DEEPSEEK_MODEL;
  }

  if (!apiKey) {
    throw new Error('AI service is not configured. Please try again later.');
  }

  var response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: modelName,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    var errText = await response.text();
    console.error('AI API error:', response.status, errText);
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }

  var result = await response.json();
  var content = (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) || '';

  if (!content) {
    throw new Error('No content was generated. Please try again.');
  }

  return content;
}

/**
 * Call GLM-4V for image recognition (multimodal).
 * Supports both data URLs (base64) and public URLs.
 */
async function callVisionAI(prompt, image) {
  var apiKey = process.env.GLM_API_KEY;
  if (!apiKey) {
    throw new Error('AI service is not configured.');
  }

  // Build multimodal message content
  var content = [
    { type: 'text', text: prompt }
  ];

  // If image starts with data:, use as data URL; otherwise treat as URL
  if (image.startsWith('data:')) {
    content.push({ type: 'image_url', image_url: { url: image } });
  } else {
    content.push({ type: 'image_url', image_url: { url: image } });
  }

  var response = await fetch(GLM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: GLM_VISION_MODEL,
      messages: [{ role: 'user', content: content }],
      temperature: 0.4,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    var errText = await response.text();
    console.error('GLM-4V API error:', response.status, errText);
    throw new Error('Image analysis service is temporarily unavailable.');
  }

  var result = await response.json();
  var visionContent = (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) || '';

  if (!visionContent) {
    throw new Error('No description was generated. Please try again.');
  }

  return visionContent;
}

/* ==================== Tool Intent Detection ==================== */

/**
 * Detect if the user's message matches a built-in tool.
 * If matched, returns the tool execution result directly (no AI call needed).
 * Supported tools: QR Code generation
 */
function detectToolIntent(messages) {
  // Get last user message
  var lastUserContent = '';
  for (var i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      lastUserContent = messages[i].content;
      break;
    }
  }
  if (!lastUserContent) return null;

  // ===== QR Code Detection =====
  var qrPatterns = [
    /generate\s+.*qr/i, /create\s+.*qr/i, /make\s+.*qr/i,
    /qr\s*code/i, /qr码/, /二维码/, /生产.*码/, /生成.*码/, /做个.*码/, /做.*二维码/
  ];

  if (qrPatterns.some(function (p) { return p.test(lastUserContent); })) {
    // Try to find URL in current message
    var urlMatch = lastUserContent.match(/https?:\/\/[^\s,，。！）)]+/);
    var encodeData = '';

    if (urlMatch) {
      encodeData = urlMatch[0];
    } else {
      // Check for reference words (this URL, 这个网址, etc.)
      var hasRef = /这个网址|this url|this link|这个链接|那个网址|the url|网址|这个/i.test(lastUserContent);
      if (hasRef) {
        // Look for URL in previous user messages
        for (var j = messages.length - 2; j >= 0; j--) {
          if (messages[j].role === 'user') {
            var prevUrl = messages[j].content.match(/https?:\/\/[^\s,，。！）)]+/);
            if (prevUrl) { encodeData = prevUrl[0]; break; }
          }
        }
      }
    }

    // If still no data, try extracting text after keyword
    if (!encodeData) {
      var afterKw = lastUserContent.match(/(?:qr\s*code|二维码|qr码)\s*(?:for|为|给|：|:)?\s*(.+)/i);
      if (afterKw && afterKw[1] && afterKw[1].trim().length > 1) {
        encodeData = afterKw[1].trim();
      }
    }

    // Last resort: use the entire message
    if (!encodeData) {
      encodeData = lastUserContent;
    }

    var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(encodeData);
    return { type: 'qr', imageUrl: qrUrl, data: encodeData, label: 'QR Code' };
  }

  return null;
}

/* ==================== Main Handler ==================== */

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

  var userId = body.userId;
  if (!userId) {
    res.writeHead(400, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Missing userId.' }));
    return;
  }

  // Check Redis configuration
  if (!getRedisUrl() || !getRedisToken()) {
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ success: false, error: 'Service is not fully configured. Please try again later.' }));
    return;
  }

  // Determine mode
  var mode = body.mode || '';
  var isStudio = mode === 'studio';
  var isImageGen = mode === 'image-gen';
  var isVision = mode === 'vision';
  var model = body.model || 'deepseek';
  var cost = (model === 'glm') ? GLM_COST_POINTS : DEEPSEEK_COST_POINTS;
  var toolLabel = '';

  /* ---------- Image Generation Mode (Pollinations) ---------- */
  if (isImageGen) {
    var promptText = (body.prompt || '').trim();
    if (!promptText) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Please provide a prompt for image generation.' }));
      return;
    }

    cost = IMAGE_GEN_COST_POINTS;
    var deductImg = await deductPoints(userId, cost);
    if (!deductImg.success) {
      res.writeHead(402, corsHeaders);
      res.end(JSON.stringify({ success: false, error: deductImg.error, creditsRemaining: deductImg.creditsRemaining }));
      return;
    }

    // Construct Pollinations URL — free, no API key needed
    var encodedPrompt = encodeURIComponent(promptText);
    var width = body.width || 1024;
    var height = body.height || 1024;
    var imageUrl = POLLINATIONS_BASE + encodedPrompt + '?width=' + width + '&height=' + height + '&nologo=true&model=flux';

    try { await recordUsage(userId, 'Image Generation', 'pollinations', cost); } catch (e) { console.error('Usage record error:', e); }

    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({ success: true, imageUrl: imageUrl, prompt: promptText, creditsRemaining: deductImg.creditsRemaining }));
    return;
  }

  /* ---------- Image Recognition Mode (GLM-4V) ---------- */
  if (isVision) {
    var imageData = body.image;
    if (!imageData) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Please provide an image to analyze.' }));
      return;
    }

    var visionPrompt = (body.prompt || 'Describe this image in detail.').trim();
    cost = VISION_COST_POINTS;

    var deductVis = await deductPoints(userId, cost);
    if (!deductVis.success) {
      res.writeHead(402, corsHeaders);
      res.end(JSON.stringify({ success: false, error: deductVis.error, creditsRemaining: deductVis.creditsRemaining }));
      return;
    }

    try {
      var visionResult = await callVisionAI(visionPrompt, imageData);

      try { await recordUsage(userId, 'Image Recognition', 'glm-4v', cost); } catch (e) { console.error('Usage record error:', e); }

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({ success: true, result: visionResult, creditsRemaining: deductVis.creditsRemaining }));
    } catch (visError) {
      console.error('Vision API error:', visError);
      try { await refundPoints(userId, cost); } catch (e) { console.error('Refund error:', e); }
      var visRemaining = await getTotalCredits(userId);
      res.writeHead(500, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Image analysis failed. Please try again.', creditsRemaining: visRemaining }));
    }
    return;
  }

  var messages;
  if (isStudio) {
    // Mode B: AI Studio free-form chat
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Missing messages array for studio mode.' }));
      return;
    }
    messages = body.messages;

    // ===== Auto Tool Detection =====
    // Check if user's request matches a built-in tool (QR code, etc.)
    // If matched, execute tool directly — no AI call needed
    var toolIntent = detectToolIntent(messages);
    if (toolIntent) {
      cost = GLM_COST_POINTS; // 0.5 credits for tool use
      var toolDeduct = await deductPoints(userId, cost);
      if (!toolDeduct.success) {
        res.writeHead(402, corsHeaders);
        res.end(JSON.stringify({ success: false, error: toolDeduct.error, creditsRemaining: toolDeduct.creditsRemaining }));
        return;
      }

      try { await recordUsage(userId, toolIntent.label, 'tool', cost); } catch (e) { console.error('Usage record error:', e); }

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        result: '',
        toolResult: toolIntent,
        creditsRemaining: toolDeduct.creditsRemaining
      }));
      return;
    }

    // No tool detected — proceed with normal AI chat
    messages = [{
      role: 'system',
      content: 'You are a helpful AI assistant on FreeToolset (freetoolset.app), a platform offering free online tools. Respond concisely and helpfully.'
    }].concat(messages);
    toolLabel = 'AI Studio';
  } else {
    // Mode A: Templated tool
    var tool = body.tool;
    var data = body.data;

    if (!tool || !PROMPT_TEMPLATES[tool]) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Invalid or missing tool type.' }));
      return;
    }

    if (!data) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ success: false, error: 'Missing input data.' }));
      return;
    }

    // Validate required fields
    var required = REQUIRED_FIELDS[tool];
    for (var i = 0; i < required.length; i++) {
      var field = required[i];
      if (!data[field] || !String(data[field]).trim()) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ success: false, error: 'Missing required field: ' + field }));
        return;
      }
    }

    var prompt = PROMPT_TEMPLATES[tool](data);
    messages = [{ role: 'user', content: prompt }];
    toolLabel = TOOL_LABELS[tool] || tool;
    // Tool mode defaults to deepseek
    model = 'deepseek';
    cost = DEEPSEEK_COST_POINTS;
  }

  // Deduct credits BEFORE calling AI
  var deductResult = await deductPoints(userId, cost);
  if (!deductResult.success) {
    res.writeHead(402, corsHeaders);
    res.end(JSON.stringify({
      success: false,
      error: deductResult.error,
      creditsRemaining: deductResult.creditsRemaining
    }));
    return;
  }

  // Call AI model
  try {
    var generatedText = await callAI(model, messages);

    // Record usage (non-blocking, don't fail if it errors)
    try {
      await recordUsage(userId, toolLabel, model, cost);
    } catch (usageErr) {
      console.error('Failed to record usage:', usageErr);
    }

    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      success: true,
      result: generatedText,
      creditsRemaining: deductResult.creditsRemaining
    }));
  } catch (error) {
    console.error('AI proxy error:', error);

    // Refund credits if AI call failed
    try {
      await refundPoints(userId, cost);
    } catch (refundErr) {
      console.error('Failed to refund:', refundErr);
    }

    // Re-read remaining credits for response
    var remainingCredits = await getTotalCredits(userId);

    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({
      success: false,
      error: error.message || 'An unexpected error occurred. Please try again later.',
      creditsRemaining: remainingCredits
    }));
  }
};

/* ==================== Refund Logic ==================== */

async function refundPoints(userId, cost) {
  var dateKey = getDateStr();
  var freeKey = 'ft:free:' + userId + ':' + dateKey;

  // Read current free usage
  var freeUsedStr = await redisGet(freeKey);
  var freeUsed = freeUsedStr ? parseInt(freeUsedStr, 10) : 0;

  if (freeUsed >= cost) {
    // Refund to free quota
    await redisSet(freeKey, String(freeUsed - cost));
  } else {
    // Refund partial to free, rest to a permanent paid batch
    var refundToFree = freeUsed;
    if (refundToFree > 0) {
      await redisSet(freeKey, '0');
    }
    var refundToPaid = cost - refundToFree;
    if (refundToPaid > 0) {
      // Refunded credits become permanent (no expiry)
      var batches = await getPaidBatches(userId);
      batches.push({ points: refundToPaid, purchasedAt: null, expiresAt: null });
      await setPaidBatches(userId, batches);
    }
  }
}

/* ==================== Get Total Credits ==================== */

async function getTotalCredits(userId) {
  var dateKey = getDateStr();
  var freeKey = 'ft:free:' + userId + ':' + dateKey;

  var freeUsedStr = await redisGet(freeKey);
  var freeUsed = freeUsedStr ? parseInt(freeUsedStr, 10) : 0;
  var freeRemaining = Math.max(0, FREE_DAILY_POINTS - freeUsed);

  // Only count valid (non-expired) paid batches
  var batches = await getPaidBatches(userId);
  var valid = getValidBatches(batches, Date.now());
  var paidBalance = paidBalanceFromBatches(valid);

  var totalPoints = freeRemaining + paidBalance;
  return totalPoints / 10;
}
