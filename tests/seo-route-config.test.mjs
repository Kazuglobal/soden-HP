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

function getSeoRoutePaths() {
  const routesSource = readText('src/app.routes.ts');
  // Every top-level route object with a `data:` block (SEO metadata) except
  // the home route ('') needs a matching static-prerender entry, since
  // crawlers/link-preview bots that don't execute JS hit these paths
  // directly and would otherwise see the generic homepage title/OGP.
  const matches = [...routesSource.matchAll(/path:\s*'([^']+)'[\s\S]*?data:\s*\{/g)];
  return matches
    .map((match) => match[1])
    .filter((routePath) => routePath !== '' && routePath !== '**');
}

test('every SEO-bearing route in app.routes.ts has a static-prerender entry', () => {
  const seoRoutePaths = getSeoRoutePaths();
  assert.ok(seoRoutePaths.length > 0, 'Expected to find at least one SEO route in src/app.routes.ts');

  const generatorSource = readText('scripts/generate-static-routes.mjs');

  for (const routePath of seoRoutePaths) {
    assert.match(
      generatorSource,
      new RegExp(`route:\\s*'${routePath}'`),
      `Expected scripts/generate-static-routes.mjs to prerender the '${routePath}' route ` +
        `(found in src/app.routes.ts data but missing from routePages)`
    );
  }
});

test('every SEO-bearing route in app.routes.ts has a vercel.json rewrite to its prerendered HTML', () => {
  const seoRoutePaths = getSeoRoutePaths();
  const vercelConfig = JSON.parse(readText('vercel.json'));
  const rewrites = vercelConfig.rewrites ?? [];

  for (const routePath of seoRoutePaths) {
    assert.ok(
      rewrites.some(
        (rewrite) => rewrite.source === `/${routePath}` && rewrite.destination === `/${routePath}/index.html`
      ),
      `Expected vercel.json to rewrite /${routePath} to /${routePath}/index.html`
    );
  }
});
