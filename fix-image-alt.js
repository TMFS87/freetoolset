const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

function updateFile(file, replacements) {
  const filePath = path.join(ROOT, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  replacements.forEach(({ from, to }) => {
    if (html.includes(from)) {
      html = html.replace(from, to);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log(`Updated: ${file}`);
  } else {
    console.log(`No changes: ${file}`);
  }
}

// 1. Image Compressor — improve alt text for original/compressed previews
updateFile('image-compressor.html', [
  { from: '<img id="originalImg" alt="Original image">', to: '<img id="originalImg" alt="Original uploaded image preview before compression">' },
  { from: '<img id="compressedImg" alt="Compressed image">', to: '<img id="compressedImg" alt="Compressed image preview after quality and size reduction">' }
]);

// 2. Image to Base64 — improve alt text for preview
updateFile('image-to-base64.html', [
  { from: '<img id="previewImg" alt="Image preview">', to: '<img id="previewImg" alt="Uploaded image preview before Base64 conversion">' }
]);

// 3. AI Studio — add alt text to dynamically generated chat images
const aiStudioPath = path.join(ROOT, 'ai-studio.html');
let aiStudio = fs.readFileSync(aiStudioPath, 'utf8');
let aiChanged = false;

// Inline preview image
if (aiStudio.includes("'<img src=\"' + src + '\">'")) {
  aiStudio = aiStudio.replace(
    "'<img src=\"' + src + '\">'",
    "'<img src=\"' + src + '\" alt=\"Uploaded image attached to chat\">'"
  );
  aiChanged = true;
}

// QR code image
if (aiStudio.includes("'<img src=\"' + qrImgUrl + '\">'")) {
  aiStudio = aiStudio.replace(
    "'<img src=\"' + qrImgUrl + '\">'",
    "'<img src=\"' + qrImgUrl + '\" alt=\"Generated QR code for ' + escapeHtml(qrData) + '\">'"
  );
  aiChanged = true;
}

// AI generated image from markdown
if (aiStudio.includes("'<img src=\"' + imgUrl + '\">'")) {
  aiStudio = aiStudio.replace(
    "'<img src=\"' + imgUrl + '\">'",
    "'<img src=\"' + imgUrl + '\" alt=\"AI generated image\">'"
  );
  aiChanged = true;
}

// Also add alt to inline preview in showInlinePreview function (if not already)
if (aiChanged) {
  fs.writeFileSync(aiStudioPath, aiStudio);
  console.log('Updated: ai-studio.html');
} else {
  console.log('No changes: ai-studio.html');
}

// 4. Ensure any <img> tags missing alt across the whole site are logged
const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
files.forEach(file => {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  // Find img tags without alt attribute (but not in JS string literals context)
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  imgMatches.forEach(imgTag => {
    if (!/alt=/i.test(imgTag)) {
      console.log(`WARN: img missing alt in ${file}: ${imgTag}`);
    }
  });
});
