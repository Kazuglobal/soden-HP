import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const INPUT_DIR = 'public/images';
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 78;
const PNG_QUALITY = 80; // for icons/logos that must stay PNG

// Images that are used as-is in the site (referenced in components)
const USED_IMAGES = new Set([
  'firstview1.png', 'firstview2.png', 'firstview3.png', 'firstview_new.jpg',
  'CEO.JPG', 'employee1.JPG', 'employee2.JPG', 'employee3.JPG',
  'companyinfo.png', 'building.png',
  'kokubo_nursery.jpg', 'sportroom.png', 'solar_sdg.png', 'solar_energy.png',
  'elct1.png', 'soden_roadmap.png',
  'community_bg.jpg', 'community_soccer_new.jpg', 'community_baseball_new.jpg',
  'recruit_hero_bright.png', 'recruit_mobile.jpg',
]);

// Small icons that should keep PNG format
const KEEP_PNG = new Set(['soden_roadmap.png']);

async function optimizeImage(filePath, fileName) {
  const ext = extname(fileName).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

  const stats = await stat(filePath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

  try {
    let pipeline = sharp(filePath);
    const metadata = await pipeline.metadata();

    // Resize if wider than MAX_WIDTH
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }

    let outputPath = filePath;
    let format = ext;

    if (KEEP_PNG.has(fileName)) {
      // Keep as optimized PNG
      pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
    } else if (ext === '.png') {
      // Convert PNG photos to JPEG (much smaller)
      const newName = fileName.replace(/\.png$/i, '.jpg');
      outputPath = join(INPUT_DIR, newName);
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
      format = '.jpg';
    } else {
      // Optimize JPEG
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    }

    const buffer = await pipeline.toBuffer();
    const newSizeMB = (buffer.length / 1024 / 1024).toFixed(2);

    // Write optimized file
    await sharp(buffer).toFile(outputPath);

    // Also generate WebP version
    const webpName = basename(outputPath, extname(outputPath)) + '.webp';
    const webpPath = join(INPUT_DIR, webpName);
    let webpPipeline = sharp(filePath);
    if (metadata.width > MAX_WIDTH) {
      webpPipeline = webpPipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }
    await webpPipeline.webp({ quality: WEBP_QUALITY }).toFile(webpPath);
    const webpStats = await stat(webpPath);
    const webpSizeMB = (webpStats.size / 1024 / 1024).toFixed(2);

    console.log(`${fileName}: ${sizeMB}MB -> ${newSizeMB}MB (${format}) / ${webpSizeMB}MB (webp)`);
  } catch (err) {
    console.error(`Error processing ${fileName}: ${err.message}`);
  }
}

async function processSDGIcons() {
  const sdgDir = join(INPUT_DIR, 'SDGs-icon');
  try {
    const files = await readdir(sdgDir);
    for (const file of files) {
      if (!file.endsWith('.png')) continue;
      const filePath = join(sdgDir, file);
      const stats = await stat(filePath);

      // Resize SDG icons to 96x96 and optimize
      await sharp(filePath)
        .resize(96, 96, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png({ compressionLevel: 9 })
        .toFile(filePath + '.tmp');

      // Also create WebP
      await sharp(filePath)
        .resize(96, 96, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .webp({ quality: 80 })
        .toFile(filePath.replace('.png', '.webp'));

      const { rename } = await import('fs/promises');
      await rename(filePath + '.tmp', filePath);

      const newStats = await stat(filePath);
      console.log(`SDG ${file}: ${(stats.size / 1024).toFixed(1)}KB -> ${(newStats.size / 1024).toFixed(1)}KB`);
    }
  } catch (err) {
    console.error(`SDG icons error: ${err.message}`);
  }
}

async function main() {
  console.log('Starting image optimization...\n');

  const files = await readdir(INPUT_DIR);

  // Process only used images first
  for (const file of files) {
    if (!USED_IMAGES.has(file)) continue;
    const filePath = join(INPUT_DIR, file);
    const s = await stat(filePath);
    if (s.isDirectory()) continue;
    await optimizeImage(filePath, file);
  }

  // Process SDG icons
  await processSDGIcons();

  console.log('\nOptimization complete!');
}

main().catch(console.error);
