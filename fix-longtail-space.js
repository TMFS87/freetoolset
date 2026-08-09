'use strict';
// Fix spacing: "免费在线" + English word -> "免费在线 English word"
const fs = require('fs');
const path = require('path');
const DIR = 'C:/Users/Administrator/freetoolset';

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
let n = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let h = fs.readFileSync(p, 'utf8');
  const before = h;
  h = h.replace(/免费在线(?=[A-Za-z])/g, '免费在线 ');
  if (h !== before) { fs.writeFileSync(p, h, 'utf8'); n++; }
}
console.log('fixed files:', n);
