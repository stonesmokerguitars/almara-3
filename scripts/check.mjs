import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../site.config.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = config.siteUrl.replace(/\/$/, '');
const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const pages = new Map();
const titles = new Set();
const descriptions = new Set();
const errors = [];
const decode = text => text.replaceAll('&amp;', '&').replaceAll('&quot;', '"');
const check = (condition, message) => { if (!condition) errors.push(message); };
for (const url of urls) {
  const path = new URL(url).pathname;
  const html = await readFile(resolve(root, '.' + path, 'index.html'), 'utf8');
  pages.set(path, html);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  check(title && !titles.has(title), path + ': missing or duplicate title');
  check(description && !descriptions.has(description), path + ': missing or duplicate meta description');
  titles.add(title); descriptions.add(description);
  check(canonical === url, path + ': canonical differs from sitemap URL');
  check([...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length === 1, path + ': expected one H1');
  const ids = [...html.matchAll(/\bid="([^"]*)"/g)].map(m=>m[1]);
  check(new Set(ids).size === ids.length, path + ': duplicate IDs');
  check([...html.matchAll(/class="nav-link active"/g)].length === 1, path + ': expected one active main navigation item');
  try {
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    check(graph.some(item=>item.url===url), path + ': structured data does not describe the canonical page');
  } catch {
    errors.push(path + ': invalid JSON-LD');
  }
  check(!html.includes('data-service='), path + ': service must link to a page, not a JavaScript modal');
}

let linkCount = 0;
const checkedAssets = new Set();
for (const [path, html] of pages) {
  for (const match of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    const raw = decode(match[2]);
    if (!raw || /^(tel:|mailto:|data:)/.test(raw)) continue;
    const url = new URL(raw, origin + path);
    if (url.origin !== origin) continue;
    const targetPath = decodeURIComponent(url.pathname);
    if (url.hash && pages.has(targetPath)) {
      const id = decodeURIComponent(url.hash.slice(1));
      check(pages.get(targetPath).includes('id="' + id + '"'), path + ': missing fragment ' + raw);
    }
    if (targetPath.endsWith('/')) {
      check(pages.has(targetPath), path + ': page missing from sitemap: ' + raw);
      linkCount++;
    } else if (!checkedAssets.has(targetPath)) {
      checkedAssets.add(targetPath);
      try { check((await stat(resolve(root, '.' + targetPath))).isFile(), path + ': missing asset ' + raw); }
      catch { errors.push(path + ': missing asset ' + raw); }
    }
  }
  for (const img of html.matchAll(/<img\b([^>]*)>/g)) {
    check(/\balt="/.test(img[1]), path + ': image without alt attribute');
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('PASS: ' + pages.size + ' pages, ' + linkCount + ' internal page links, ' + checkedAssets.size + ' assets.');
  console.log('Unique titles/descriptions, H1s, IDs, canonicals, JSON-LD, sitemap and fragments are valid.');
}
