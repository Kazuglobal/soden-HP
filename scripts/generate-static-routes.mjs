import fs from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');
const sourcePath = path.join(distDir, 'index.html');

const routePages = [
  {
    route: 'services',
    title: '事業内容 | 株式会社創電工業（青森県八戸市）',
    description: '株式会社創電工業の事業内容。電気設備工事・電気通信工事・消防設備・空調設備・太陽光発電・物流システムの設計施工から保守管理まで、青森県八戸市を拠点に一貫対応します。',
    keywords: '事業内容,サービス,電気設備工事,電気通信工事,消防設備,空調設備,太陽光発電,物流システム,保守管理,八戸市,青森県,創電工業',
    image: 'https://soudenkougyou.com/images/elct1.jpg',
    imageAlt: '株式会社創電工業の事業内容'
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
