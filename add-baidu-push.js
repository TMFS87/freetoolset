// Injects Baidu auto-push <script> (自动推送) before </body> on every HTML page,
// adds a verification placeholder to index.html <head>, and patches the generator
// templates so future pages also include it. Idempotent + CRLF-safe.
const fs = require("fs");
const path = require("path");

const SNIPPET = `
<script>
(function(){var bp=document.createElement('script');var p=location.protocol.split(':')[0];bp.src=p==='https'?'https://zz.bdstatic.com/linksubmit/push.js':'http://push.zhanzhang.baidu.com/push.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(bp,s);})();
</script>`;
const MARK = "<!-- BAIDU_AUTO_PUSH -->";

function injectPage(file) {
  let h = fs.readFileSync(file, "utf8");
  if (h.includes(MARK)) return false;
  if (!h.includes("</body>")) return false;
  h = h.replace(/<\/body>/, MARK + SNIPPET + "\n</body>");
  fs.writeFileSync(file, h, "utf8");
  return true;
}

let n = 0;
for (const f of fs.readdirSync(".")) {
  if (f.endsWith(".html") && injectPage(f)) n++;
}
const blog = "blog";
if (fs.existsSync(blog)) {
  for (const f of fs.readdirSync(blog)) {
    if (f.endsWith(".html") && injectPage(path.join(blog, f))) n++;
  }
}

// Verification placeholder in <head> (replaced with real code once user provides it)
let idx = fs.readFileSync("index.html", "utf8");
if (!idx.includes("BAIDU_SITE_VERIFY")) {
  idx = idx.replace(/<meta charset="utf-8">/, '<meta charset="utf-8">\n  <!-- BAIDU_SITE_VERIFY -->');
  fs.writeFileSync("index.html", idx, "utf8");
  console.log("Added BAIDU_SITE_VERIFY placeholder to index.html");
}

// Forward-compat: patch generator templates
for (const gf of ["gen-tools.js", "blog-gen2.js"]) {
  if (!fs.existsSync(gf)) continue;
  let g = fs.readFileSync(gf, "utf8");
  if (g.includes(MARK)) { console.log("Generator already patched:", gf); continue; }
  if (g.includes("</body>")) {
    g = g.replace(/<\/body>/, MARK + SNIPPET + "\n</body>");
    fs.writeFileSync(gf, g, "utf8");
    console.log("Patched generator template:", gf);
  }
}

console.log("Injected Baidu auto-push into " + n + " pages");
