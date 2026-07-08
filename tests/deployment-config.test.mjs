import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function readText(relativePath) {
  return fs.readFileSync(path.resolve(relativePath), 'utf8');
}

function getCspValue() {
  const vercelConfig = JSON.parse(readText('vercel.json'));
  const allHeaders = vercelConfig.headers ?? [];

  for (const rule of allHeaders) {
    for (const header of rule.headers ?? []) {
      if (header.key === 'Content-Security-Policy') {
        return header.value;
      }
    }
  }

  throw new Error('Content-Security-Policy header was not found in vercel.json');
}

function getDirectiveValues(csp, directiveName) {
  const directive = csp
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${directiveName} `));

  if (!directive) {
    return [];
  }

  return directive
    .slice(directiveName.length)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function listPublicAssets(rootDirectory) {
  const rootPath = path.resolve(rootDirectory);
  const assets = new Set();
  const queue = [rootPath];

  while (queue.length > 0) {
    const current = queue.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(absolutePath);
        continue;
      }

      const relativePath = path.relative(rootPath, absolutePath).replaceAll(path.sep, '/');
      assets.add(`/${relativePath}`);
    }
  }

  return assets;
}

test('CSP allows the external resources referenced by index.html', () => {
  const html = readText('index.html');
  const csp = getCspValue();

  // Tailwind is now compiled at build time (no runtime CDN), so the only
  // external resources index.html loads are Google Fonts.
  const requiredPolicies = [
    ['style-src', 'https://fonts.googleapis.com'],
    ['font-src', 'https://fonts.gstatic.com']
  ];

  assert.match(html, /https:\/\/fonts\.googleapis\.com/);
  assert.match(html, /https:\/\/fonts\.gstatic\.com/);

  for (const [directiveName, expectedValue] of requiredPolicies) {
    const directiveValues = getDirectiveValues(csp, directiveName);
    assert.ok(
      directiveValues.includes(expectedValue),
      `${directiveName} must allow ${expectedValue}, but was ${directiveValues.join(' ')}`
    );
  }
});

test('CSP no longer permits the runtime Tailwind CDN or unsafe-eval', () => {
  const html = readText('index.html');
  const csp = getCspValue();

  assert.doesNotMatch(html, /cdn\.tailwindcss\.com/);
  assert.doesNotMatch(csp, /unsafe-eval/);
  assert.doesNotMatch(csp, /cdn\.tailwindcss\.com/);
});

test('route metadata images point to files that are shipped from public/', () => {
  const routeSource = readText('src/app.routes.ts');
  const appSource = readText('src/app.component.ts');
  const referencedPaths = [
    ...routeSource.matchAll(/'((?:\/[^'"]+)\.(?:png|jpg|jpeg|webp|svg))'/g),
    ...appSource.matchAll(/'((?:\/[^'"]+)\.(?:png|jpg|jpeg|webp|svg))'/g)
  ].map((match) => match[1]);

  const shippedAssets = listPublicAssets('public');

  for (const assetPath of referencedPaths) {
    assert.ok(
      shippedAssets.has(assetPath),
      `Expected ${assetPath} to exist in public/, but it was missing`
    );
  }
});
