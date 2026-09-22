// Builds the web images from the originals in src/.
//   src/photos/*.jpg  -> images/<name>-640.webp and images/<name>-1280.webp
//   src/logo.png      -> images/logo.webp, favicons, and the link-preview image
// Run with: npm run build:images
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const src = (...p) => path.join(root, 'src', ...p);
const out = (...p) => path.join(root, 'images', ...p);

const WIDTHS = [640, 1280];

async function photos() {
  const files = fs.readdirSync(src('photos')).filter(f => /\.jpe?g$/i.test(f));
  for (const file of files) {
    const name = path.parse(file).name;
    for (const width of WIDTHS) {
      await sharp(src('photos', file))
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toFile(out(`${name}-${width}.webp`));
    }
  }
  return files.length;
}

async function logos() {
  await sharp(src('logo.png')).webp({ quality: 90 }).toFile(out('logo.webp'));
  await sharp(src('quality-websites.png')).resize(64, 64).webp({ quality: 85 }).toFile(out('quality-websites.webp'));

  // The round emblem on the left of the logo makes the browser-tab icon
  const emblem = sharp(src('logo.png')).extract({ left: 0, top: 3, width: 112, height: 112 });
  const emblemPng = await emblem.png().toBuffer();
  await sharp(emblemPng).resize(32, 32).png().toFile(out('favicon-32.png'));
  await sharp({ create: { width: 180, height: 180, channels: 4, background: '#ffffff' } })
    .composite([{ input: await sharp(emblemPng).resize(156, 156).toBuffer(), top: 12, left: 12 }])
    .png()
    .toFile(out('apple-touch-icon.png'));
}

// 1200x630 image shown when the site is shared on WhatsApp, Facebook etc.
async function linkPreview() {
  const W = 1200, H = 630, half = W / 2;
  const photo = (file, pos) => sharp(src('photos', file)).rotate().resize(half, H, { fit: 'cover', position: pos }).toBuffer();
  const logo = await sharp(src('logo.png')).resize({ width: 440 }).toBuffer();
  const logoMeta = await sharp(logo).metadata();

  const label = (x, n, name) => `
    <g transform="translate(${x},32)">
      <rect width="${name.length * 19 + 200}" height="54" rx="27" fill="#111827" stroke="#f59e0b" stroke-width="4"/>
      <text x="26" y="36" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#eab308">CAMPUS ${n} ·</text>
      <text x="172" y="36" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#ffffff">${name}</text>
    </g>`;
  const overlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#111827" stop-opacity="0"/>
        <stop offset="1" stop-color="#111827" stop-opacity="0.95"/>
      </linearGradient></defs>
      <rect x="${half - 3}" y="0" width="6" height="${H}" fill="#f59e0b"/>
      <rect x="0" y="330" width="${W}" height="300" fill="url(#g)"/>
      ${label(32, 1, 'MEANWOOD')}
      ${label(half + 32, 2, 'PHI')}
      <rect x="32" y="${H - 190}" width="${logoMeta.width + 32}" height="${logoMeta.height + 24}" rx="16" fill="#ffffff"/>
      <text x="32" y="${H - 34}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#ffffff">Two campuses in Lusaka · Nursery to Grade 7 · Fees from K800</text>
    </svg>`);

  await sharp({ create: { width: W, height: H, channels: 3, background: '#111827' } })
    .composite([
      { input: await photo('meanwood-entrance-school-bus.jpg', 'centre'), left: 0, top: 0 },
      { input: await photo('phi-classroom-writing.jpg', 'centre'), left: half, top: 0 },
      { input: overlay, left: 0, top: 0 },
      { input: logo, left: 48, top: H - 178 },
    ])
    .jpeg({ quality: 82 })
    .toFile(out('og-image.jpg'));
}

(async () => {
  fs.mkdirSync(out(), { recursive: true });
  const n = await photos();
  await logos();
  await linkPreview();
  console.log(`Built ${n} photos x ${WIDTHS.length} sizes, logos, favicons and og-image.jpg`);
})().catch(err => { console.error(err); process.exit(1); });
