/**
 * Vercel Serverless Function — AI Proxy for FreeToolset
 * Routes tool type to DeepSeek API with appropriate prompt templates.
 * Compatible with OpenAI API format.
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/* ---------- Prompt Templates ---------- */
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

/* ---------- Required Fields per Tool ---------- */
const REQUIRED_FIELDS = {
  'product-description': ['productName', 'features', 'audience', 'tone'],
  'seo-meta': ['pageTitle', 'keywords', 'contentType'],
  'blog-writer': ['topic', 'keywords', 'tone', 'length'],
  'email-subject': ['topic', 'product', 'audience'],
  'content-rewriter': ['text', 'tone', 'variation']
};

/* ---------- CORS Headers ---------- */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

/* ---------- Handler ---------- */
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
    res.end(JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }));
    return;
  }

  // Check API key configuration
  var apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.writeHead(500, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'AI service is not configured. Please try again later.' }));
    return;
  }

  // Parse request body (Vercel may auto-parse, but handle both)
  var body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    res.writeHead(400, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Invalid request body.' }));
    return;
  }

  var tool = body.tool;
  var data = body.data;

  // Validate tool type
  if (!tool || !PROMPT_TEMPLATES[tool]) {
    res.writeHead(400, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Invalid or missing tool type.' }));
    return;
  }

  // Validate input data
  if (!data) {
    res.writeHead(400, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'Missing input data.' }));
    return;
  }

  var required = REQUIRED_FIELDS[tool];
  for (var i = 0; i < required.length; i++) {
    var field = required[i];
    if (!data[field] || !String(data[field]).trim()) {
      res.writeHead(400, CORS_HEADERS);
      res.end(JSON.stringify({ success: false, error: 'Missing required field: ' + field }));
      return;
    }
  }

  // Build prompt from template
  var prompt = PROMPT_TEMPLATES[tool](data);

  // Call DeepSeek API
  try {
    var response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      var errText = await response.text();
      console.error('DeepSeek API error:', response.status, errText);
      res.writeHead(502, CORS_HEADERS);
      res.end(JSON.stringify({ success: false, error: 'AI service is temporarily unavailable. Please try again later.' }));
      return;
    }

    var result = await response.json();
    var generatedText = (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) || '';

    if (!generatedText) {
      res.writeHead(500, CORS_HEADERS);
      res.end(JSON.stringify({ success: false, error: 'No content was generated. Please try again.' }));
      return;
    }

    res.writeHead(200, CORS_HEADERS);
    res.end(JSON.stringify({ success: true, result: generatedText }));
  } catch (error) {
    console.error('AI proxy error:', error);
    res.writeHead(500, CORS_HEADERS);
    res.end(JSON.stringify({ success: false, error: 'An unexpected error occurred. Please try again later.' }));
  }
};
