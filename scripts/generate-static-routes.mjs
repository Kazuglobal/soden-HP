import fs from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');
const sourcePath = path.join(distDir, 'index.html');

// NOTE: keep every entry's `route` in sync with the `data`-bearing routes in
// src/app.routes.ts (any route besides '' that has SEO `data`). This list
// must contain one entry per such route or crawlers/link-preview bots that
// don't execute JS will see the generic homepage title/OGP for that route.
// tests/seo-route-config.test.mjs cross-checks the two files stay in sync.
const routePages = [
  {
    route: 'services',
    title: '事業内容 | 株式会社創電工業（青森県八戸市）',
    description: '株式会社創電工業の事業内容。電気設備工事・電気通信工事・消防設備・空調設備・太陽光発電・物流システムの設計施工から保守管理まで、青森県八戸市を拠点に一貫対応します。',
    keywords: '事業内容,サービス,電気設備工事,電気通信工事,消防設備,空調設備,太陽光発電,物流システム,保守管理,八戸市,青森県,創電工業',
    image: 'https://soudenkougyou.com/images/elct1.jpg',
    imageAlt: '株式会社創電工業の事業内容'
  },
  {
    route: 'company',
    title: '会社概要 | 株式会社創電工業（青森県八戸市）',
    description: '株式会社創電工業の会社概要・沿革・所在地・資格・事業内容。1987年創業、青森県八戸市を拠点に電気設備工事・空調設備・消防設備・物流システムの設計施工から保守管理まで38年の実績。',
    keywords: '会社概要,企業情報,沿革,所在地,電気工事,電気設備工事,八戸市,青森県,創電工業,代表取締役,資本金,従業員数,許可番号',
    image: 'https://soudenkougyou.com/images/companyinfo.jpg',
    imageAlt: '株式会社創電工業の会社情報'
  },
  {
    route: 'cases',
    title: '施工事例｜株式会社創電工業（青森県八戸市の電気設備工事）',
    description: '青森県八戸市の株式会社創電工業による電気設備工事・電気通信工事・太陽光発電設備の施工事例をご紹介。公共施設から民間ビル、個人住宅まで、八戸市・三沢市など県南地域での実績と技術力をご覧いただけます。',
    keywords: '施工事例,施工実績,電気工事,電気設備工事,太陽光発電,八戸市,青森県,創電工業,公共工事,ビル電気工事,八戸 電気工事',
    image: 'https://soudenkougyou.com/images/building.jpg',
    imageAlt: '株式会社創電工業の施工事例'
  },
  {
    route: 'contact',
    title: 'お問い合わせ｜株式会社創電工業（青森県八戸市の電気設備工事）',
    description: '電気設備工事・電気通信工事・太陽光発電設備のご相談やお見積りは、青森県八戸市の株式会社創電工業までお気軽にお問い合わせください。電話番号0178-25-2172、平日8:00-18:00受付。',
    keywords: 'お問い合わせ,電気工事 見積もり,八戸 電気工事,電気工事 相談,創電工業,八戸市,青森県',
    image: 'https://soudenkougyou.com/images/companyinfo.jpg',
    imageAlt: '株式会社創電工業へのお問い合わせ'
  },
  {
    route: 'access',
    title: 'アクセス｜株式会社創電工業（青森県八戸市の電気設備工事会社）',
    description: '株式会社創電工業の所在地・地図・アクセス情報。青森県八戸市大字大久保字小久保平19-7、TEL 0178-25-2172。八戸市・三沢市・おいらせ町など県南地域の電気工事に対応しています。',
    keywords: 'アクセス,所在地,地図,創電工業,八戸市,青森県,電気工事会社',
    image: 'https://soudenkougyou.com/images/companyinfo.jpg',
    imageAlt: '株式会社創電工業の所在地'
  },
  {
    route: 'recruit',
    title: '採用情報 | 株式会社創電工業（青森県八戸市）',
    description: '株式会社創電工業の採用情報。電気工事士・施工管理技士・未経験者歓迎。青森県八戸市の安定した電気設備工事会社で一緒に働きませんか。福利厚生充実・資格取得支援あり。',
    keywords: '採用情報,求人,電気工事士,施工管理技士,電気工事会社求人,未経験歓迎,八戸市求人,青森県求人,創電工業採用,転職,新卒,第二種電気工事士,第一種電気工事士',
    image: 'https://soudenkougyou.com/images/recruit_hero_bright.jpg',
    imageAlt: '株式会社創電工業 採用情報'
  },
  {
    route: 'privacy',
    title: 'プライバシーポリシー | 株式会社創電工業（青森県八戸市）',
    description: '株式会社創電工業のプライバシーポリシー。お問い合わせフォーム・採用エントリーフォームで取得する個人情報の取り扱い方針についてご説明します。',
    keywords: 'プライバシーポリシー,個人情報保護方針,創電工業,八戸市,青森県',
    image: 'https://soudenkougyou.com/images/companyinfo.jpg',
    imageAlt: '株式会社創電工業'
  }
];

function replaceTag(html, pattern, replacement, missingMessage) {
  if (!pattern.test(html)) {
    throw new Error(missingMessage);
  }
  return html.replace(pattern, replacement);
}

function buildPageHtml(sourceHtml, page) {
  const pageUrl = `https://soudenkougyou.com/${page.route}`;

  let html = sourceHtml;
  html = replaceTag(html, /<title>.*?<\/title>/s, `<title>${page.title}</title>`, 'Missing <title> tag');
  html = replaceTag(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${page.description}">`, 'Missing description meta tag');
  html = replaceTag(html, /<meta name="keywords" content="[^"]*"\s*\/?>/, `<meta name="keywords" content="${page.keywords}">`, 'Missing keywords meta tag');
  html = replaceTag(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${page.title}">`, 'Missing og:title meta tag');
  html = replaceTag(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${page.description}">`, 'Missing og:description meta tag');
  html = replaceTag(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${pageUrl}">`, 'Missing og:url meta tag');
  html = replaceTag(html, /<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${page.image}">`, 'Missing og:image meta tag');
  html = replaceTag(html, /<meta property="og:image:alt" content="[^"]*"\s*\/?>/, `<meta property="og:image:alt" content="${page.imageAlt}">`, 'Missing og:image:alt meta tag');
  html = replaceTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${page.title}">`, 'Missing twitter:title meta tag');
  html = replaceTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${page.description}">`, 'Missing twitter:description meta tag');
  html = replaceTag(html, /<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${page.image}">`, 'Missing twitter:image meta tag');
  html = replaceTag(html, /<meta name="twitter:image:alt" content="[^"]*"\s*\/?>/, `<meta name="twitter:image:alt" content="${page.imageAlt}">`, 'Missing twitter:image:alt meta tag');
  html = replaceTag(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${pageUrl}">`, 'Missing canonical link tag');

  return html;
}

async function main() {
  const sourceHtml = await fs.readFile(sourcePath, 'utf8');

  for (const page of routePages) {
    const outputDir = path.join(distDir, page.route);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, 'index.html'), buildPageHtml(sourceHtml, page), 'utf8');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
