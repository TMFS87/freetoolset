// Baidu active push (主动推送) — pushes all sitemap URLs to Baidu on every deploy.
// Requires env BAIDU_PUSH_TOKEN (from 百度搜索资源平台 -> 链接提交 -> 主动推送).
// Gracefully no-ops when the token is absent so deploys never fail.
const http = require("http");
const fs = require("fs");
const path = require("path");

const SITE = "www.freetoolset.app";
const TOKEN = process.env.BAIDU_PUSH_TOKEN;
const ROOT = __dirname;

if (!TOKEN) {
  console.log("[baidu-push] BAIDU_PUSH_TOKEN not set — skipped.");
  process.exit(0);
}

const xml = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(m => m[1].trim())
  .filter(Boolean)
  .slice(0, 10); // Baidu 主动推送日配额有限，新站通常每天 10 条；先推首页+Top 9
if (!urls.length) { console.log("[baidu-push] no URLs found in sitemap"); process.exit(0); }

const body = urls.join("\n");
const data = Buffer.from(body, "utf8");
const u = new URL("http://data.zz.baidu.com/urls?site=" + SITE + "&token=" + TOKEN);
const req = http.request({
  hostname: u.hostname,
  path: u.pathname + u.search,
  method: "POST",
  headers: { "Content-Type": "text/plain", "Content-Length": data.length }
}, resp => {
  let d = "";
  resp.on("data", c => d += c);
  resp.on("end", () => {
    console.log("[baidu-push] HTTP " + resp.statusCode + " -> " + d);
    process.exit(0);
  });
});
req.on("error", e => { console.log("[baidu-push] error " + e.message); process.exit(0); });
req.write(data);
req.end();
