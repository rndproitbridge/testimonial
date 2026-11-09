#!/usr/bin/env node
/* Builds ONE self-contained HTML file for uploading on its own:
   site-config.js and a fresh copy of the Google Sheet are embedded inside it.

   node tools/build-single.mjs            → dist/success-stories.html (sheet copy downloaded now)
   node tools/build-single.mjs --local    → uses sheet-template/*.csv instead of the live sheet

   Media must be web links (Google Drive, YouTube…) in the sheet: a single
   uploaded HTML file cannot reach files in assets/. The build warns about any
   assets/ paths still in the sheet. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const read = (p) => readFile(new URL(p, root), 'utf8');
const cfg = await read('site-config.js');
const pick = (k) => (cfg.match(new RegExp(k + "\\s*:\\s*'([^']*)'")) || [])[1] || '';
const local = process.argv.includes('--local');

async function sheet(url, file, must) {
  let text;
  if (local || !url) text = await read('sheet-template/' + file);
  else {
    const res = await fetch(url + (url.includes('?') ? '&' : '?') + '_=' + Date.now(), { redirect: 'follow' });
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    text = await res.text();
  }
  text = text.replace(/^﻿/, '');
  const head = text.split(/\r?\n/, 1)[0].toLowerCase();
  if (!must.every((h) => head.includes(h))) throw new Error(`${file}: not the published CSV (first row: ${head.slice(0, 60)})`);
  return text;
}
const stories = await sheet(pick('STORIES_CSV'), 'Stories.csv', ['type', 'name']);
const stats = await sheet(pick('STATS_CSV'), 'Stats.csv', ['where', 'value']);

// never let embedded text close the <script> early
const safe = (s) => s.replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--');
const snapshot = 'window.SS_SNAPSHOT = ' + JSON.stringify({ generated: new Date().toISOString(), stories, stats }) + ';';

let html = await read('index.html');
const a = '<script src="site-config.js"></script>', b = '<script src="data/snapshot.js"></script>';
if (!html.includes(a) || !html.includes(b)) throw new Error('index.html no longer has the two script tags to replace');
html = html.replace(a, () => '<script>\n/* site-config.js (embedded) */\n' + safe(cfg) + '\n</script>')
           .replace(b, () => '<script>\n/* sheet snapshot (embedded ' + new Date().toISOString().slice(0, 10) + ') */\n' + safe(snapshot) + '\n</script>');

await mkdir(new URL('dist/', root), { recursive: true });
// index.html is what web servers (nginx, Vercel, Netlify…) open for the site's address;
// success-stories.html is the same file for uploading under that name.
await writeFile(new URL('dist/index.html', root), html);
await writeFile(new URL('dist/success-stories.html', root), html);

const localPaths = [...stories.matchAll(/(?:^|,)"?(assets\/[^",\r\n]+)/gm)].map((m) => m[1]);
console.log(`dist/index.html + dist/success-stories.html written (${(html.length / 1024).toFixed(0)} KB, sheet copy from ${local || !pick('STORIES_CSV') ? 'sheet-template' : 'Google Sheets'})`);
if (localPaths.length) {
  console.log(`\n⚠ ${localPaths.length} cells in the sheet still point to local files, which will NOT load from a single uploaded HTML file:`);
  [...new Set(localPaths)].forEach((p) => console.log('   ' + p));
  console.log('\nUpload the assets folder to Google Drive and run "Success Stories → Link media from a Drive folder" in the sheet, then build again.');
} else console.log('✓ Every media cell is a web link. This file can be uploaded on its own.');
