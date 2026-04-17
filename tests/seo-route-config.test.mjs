import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const CANONICAL_ORIGIN = 'https://soudenkougyou.com';
const LEGACY_ORIGIN = 'https://www.soden-kogyo.co.jp';

function readText(relativePath) {
  return fs.readFileSync(path.resolve(relativePath), 'utf8');
}

test('index.html uses the canonical soudenkougyou.com homepage URL', () => {
  const html = readText('index.html');

  assert.match(html, /<link rel="canonical" href="https:\/\/soudenkougyou\.com\/"/);
  assert.match(html, /<meta property="og:url" content="https:\/\/soudenkougyou\.com\/"/);
  assert.doesNotMatch(html, new RegExp(LEGACY_ORIGIN.replaceAll('.', '\\.')));
});

test('application routes include a dedicated /services page', () => {
  const routesSource = readText('src/app.routes.ts');

  assert.match(routesSource, /path:\s*'services'/);
});

test('vercel.json rewrites /services to a dedicated static HTML entry', () => {
  const vercelConfig = JSON.parse(readText('vercel.json'));

  assert.ok(
    (vercelConfig.rewrites ?? []).some(
      (rewrite) => rewrite.source === '/services' && rewrite.destination === '/services/index.html'
    ),
    'Expected vercel.json to rewrite /services to /services/index.html'
  );
});
