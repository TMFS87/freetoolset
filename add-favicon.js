const fs = require("fs");
const path = require("path");

const EXCLUDE_DIRS = new Set([".vercel", ".git", "node_modules", "_promote_backup", ".workbuddy"]);
const FAVICON_RE = /<link[^>]+rel=["']?(?:icon|shortcut icon)["']?[^>]*>/i;

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      walk(full, cb);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      cb(full);
    }
  }
}

walk(".", (file) => {
  let html = fs.readFileSync(file, "utf8");
  if (FAVICON_RE.test(html)) return;
  const eol = html.includes("\r\n") ? "\r\n" : "\n";
  const link = `  <link rel="icon" type="image/svg+xml" href="/favicon.svg">${eol}`;
  html = html.replace(/<\/head>/i, link + "</head>");
  fs.writeFileSync(file, html, "utf8");
  console.log("added favicon link to", file);
});
