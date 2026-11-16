/**
 * Generates responsive variants of the case-study screen images.
 *
 * The source files are 6000px wide (324KB-1.27MB each) and were being served
 * at full size to phones, where they display at ~375px. This emits 1200w and
 * 2400w siblings so `srcset` can hand small screens a small file.
 *
 * Run with: node scripts/generate-responsive-screens.mjs
 * Existing variants are skipped, so it is safe to re-run after adding art.
 */
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

const DIR = path.join(process.cwd(), 'public/assets/images/screens');
const WIDTHS = [1200, 2400];
// Only worth splitting files meaningfully wider than the largest variant.
const MIN_SOURCE_WIDTH = 3000;

const variantName = (file, width) => file.replace(/\.webp$/, `-${width}w.webp`);

const files = (await readdir(DIR)).filter((f) => f.endsWith('.webp') && !/-\d+w\.webp$/.test(f));

let created = 0;
let skipped = 0;
let savedKb = 0;

for (const file of files) {
    const src = path.join(DIR, file);
    const meta = await sharp(src).metadata();

    if (!meta.width || meta.width < MIN_SOURCE_WIDTH) {
        skipped++;
        continue;
    }

    const originalKb = Math.round((await stat(src)).size / 1024);

    for (const width of WIDTHS) {
        if (width >= meta.width) continue;

        const outPath = path.join(DIR, variantName(file, width));
        if (existsSync(outPath)) continue;

        await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(outPath);

        const outKb = Math.round((await stat(outPath)).size / 1024);
        created++;
        if (width === WIDTHS[0]) savedKb += originalKb - outKb;
        console.log(`  ${variantName(file, width).padEnd(34)} ${String(outKb).padStart(5)}KB   (from ${originalKb}KB)`);
    }
}

console.log(`\ncreated=${created} skippedSmallSources=${skipped}`);
console.log(`approx saving per mobile image load: ${savedKb}KB across ${files.length - skipped} images`);
