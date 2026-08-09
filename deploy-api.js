const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const TOKEN = process.env.VERCEL_TOKEN;
const TEAM = "tmfs";
const ROOT = __dirname;
const SKIP = new Set([".env.example", ".gitignore", ".vercelignore", "deploy-api.js", "seo-enhance.js", "blog-gen.js", "blog-gen2.js", "blog-data.js", "gen-depth.js", "gen-og.js", "gen-og.py", "gen-tools.js", "tools-data.js", "patch-index.js", "_cards.html", "_sitemap_entries.xml", "baidu-push.js", "add-baidu-push.js", "add-favicon.js", "bilingual-seo.js", "seo-faq.js", "outreach-copy.md", "promo-copy.md", "promo-comments.md", "gen-categories.js", "inject-home.js", "fix-i18n-index.js", "build-i18n-dict.js", "fix-shared-i18n.js", "dedup-i18n-attrs.js", "fix-breadcrumbs-i18n.js", "optimize-homepage.js", "add-more-tools-section.js", "fix-image-alt.js", "fix-more-tools-i18n.js", "inject-longtail.js", "fix-longtail-space.js", "inject-ymyl-disclaimer.js", "inject-trust-footer.js", "fix-ga4-id.js", "inject-index.js", "inject-category.js", "inject-analytics.js", "inject-blog-cta.js", "merge-sitemap.js", "enrich-category.js", "enrich-homepage.js", "fix-counts.js", "fix-title-counts.js", "fix-lang-hreflang.js", "fix-breadcrumbs.js", "tools-extra.js"]);

function sha1(buf) {
  return crypto.createHash("sha1").update(buf).digest("hex");
}

function walk(dir, base, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".vercel" || e.name === ".git" || e.name === ".workbuddy" || e.name === "node_modules" || e.name === "_promote_backup") continue;
    const full = path.join(dir, e.name);
    const rel = path.posix.join(base, e.name);
    if (e.isDirectory()) walk(full, rel, out);
    else if (!SKIP.has(e.name) || base !== ".") out.push({ rel, full });
  }
}

function req(opts, body) {
  return new Promise((res, rej) => {
    const r = https.request(opts, resp => {
      let d = "";
      resp.on("data", c => d += c);
      resp.on("end", () => {
        try { res({ status: resp.statusCode, body: JSON.parse(d) }); } catch (e) { res({ status: resp.statusCode, body: { raw: d } }); }
      });
    });
    r.on("error", rej);
    if (body) r.write(body);
    r.end();
  });
}

function putRaw(url, buf, digest) {
  return new Promise((res, rej) => {
    const u = new URL(url);
    const r = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": buf.length,
        "x-vercel-digest": "sha=" + digest
      }
    }, resp => {
      let d = "";
      resp.on("data", c => d += c);
      resp.on("end", () => res({ status: resp.statusCode, body: d }));
    });
    r.on("error", rej);
    r.write(buf);
    r.end();
  });
}

async function uploadFile(buf, sha) {
  const up = await req(
    { hostname: "api.vercel.com", path: "/v2/files?teamId=" + TEAM, method: "POST",
      headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/octet-stream", "x-vercel-digest": sha, "Content-Length": buf.length } },
    buf
  );
  return up.status === 200 || up.status === 201;
}

async function createDeployment(fileEntries) {
  const payload = {
    name: "freetoolset",
    target: "production",
    projectSettings: { framework: null, buildCommand: null, outputDirectory: null, installCommand: null },
    files: fileEntries.map(f => ({ file: f.file, sha: f.sha })),
  };
  return await req(
    { hostname: "api.vercel.com", path: "/v13/deployments?teamId=" + TEAM, method: "POST",
      headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" } },
    JSON.stringify(payload)
  );
}

(async () => {
  const files = [];
  walk(ROOT, ".", files);

  const fileEntries = files.map(f => {
    const buf = fs.readFileSync(f.full);
    return { file: f.rel.split(path.sep).join("/"), sha: sha1(buf), buf };
  });

  console.log("Creating deployment for", fileEntries.length, "files");

  let post = await createDeployment(fileEntries);

  // API may return 400 missing_files; upload missing blobs and retry.
  if (post.status === 400 && post.body && post.body.error && post.body.error.code === "missing_files") {
    const missingShas = post.body.error.missing || [];
    console.log("Missing blobs:", missingShas.length, "- uploading...");
    for (const sha of missingShas) {
      const entry = fileEntries.find(f => f.sha === sha);
      if (!entry) { console.log("WARN: no local file for missing sha", sha); continue; }
      const ok = await uploadFile(entry.buf, entry.sha);
      if (!ok) { console.log("UPLOAD FAIL", entry.file); process.exit(1); }
      console.log("UPLOADED", entry.file);
    }
    post = await createDeployment(fileEntries);
  }

  if (post.status !== 200 && post.status !== 201) {
    console.log("DEPLOY CREATE FAILED", post.status, JSON.stringify(post.body).slice(0, 500));
    process.exit(1);
  }

  const dep = post.body;
  const id = dep.id || (dep.deployment && dep.deployment.id);
  console.log("Deployment id=" + id, "url=" + (dep.url || ""));

  // Poll until READY
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 8000));
    const s = await req({ hostname: "api.vercel.com", path: "/v13/deployments/" + id + "?teamId=" + TEAM, method: "GET",
      headers: { Authorization: "Bearer " + TOKEN } });
    const b = s.body;
    const rs = b.readyState || b.state;
    console.log("t+" + (i * 8) + "s readyState=" + rs + (b.errorCode ? " err=" + b.errorCode : ""));
    if (rs === "READY") {
      console.log("=== READY === url=" + b.url + " alias=" + JSON.stringify(b.alias));
      // Baidu active push (no-op if BAIDU_PUSH_TOKEN not set)
      try {
        spawn(process.execPath, ["baidu-push.js"], { stdio: "inherit", env: process.env });
        console.log("[deploy] triggered Baidu push (if token set)");
      } catch (e) { console.log("[deploy] baidu push spawn failed:", e.message); }
      break;
    }
    if (rs === "ERROR" || rs === "CANCELED") { console.log("FAILED", b.errorMessage || JSON.stringify(b.error || "").slice(0, 200)); break; }
  }
})();
