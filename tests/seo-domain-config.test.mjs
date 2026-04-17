import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const CANONICAL_ORIGIN = 'https://soudenkougyou.com';
const LEGACY_ORIGIN = 'https://www.soden-kogyo.co.jp';

function readPublicFile(fileName) {
  return fs.readFileSync(path.resolve('public', fileName), 'utf8');
}

test('robots.txt points to the canonical sitemap origin', () => {
  const robots = readPublicFile('robots.txt');

  assert.match(robots, new RegExp(`Sitemap:\\s*${CANONICAL_ORIGIN}/sitemap\\.xml`));
  assert.doesNotMatch(robots, new RegExp(LEGACY_ORIGIN.replaceAll('.', '\\.')));
});

test('sitemap.xml only lists canonical soudenkougyou.com URLs', () => {
  const sitemap = readPublicFile('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  assert.ok(urls.length > 0, 'Expected sitemap.xml to contain at least one URL');

  for (const url of urls) {
    assert.match(url, new RegExp(`^${CANONICAL_ORIGIN.replaceAll('.', '\\.')}(?:/|$)`));
    assert.doesNotMatch(url, new RegExp(LEGACY_ORIGIN.replaceAll('.', '\\.')));
  }
});
