/**
 * One-off: produce web-sized copies of the oversized source images.
 *
 *   node scripts/optimise-large-images.mjs
 *
 * Companion to optimise-photos.mjs, which only covers the `IMG_*` camera
 * originals. This one picks up the *named* artwork (Peradeniya.jpg, "theru
 * festival.jpg", and friends) — several of which ship at 15-20MB each and are
 * imported directly by components, so they land in the bundle at full size.
 *
 * Originals are never touched. Copies are written to src/assets/optimised/,
 * mirroring the source folder layout so the only thing an import has to change
 * is the directory (and, for opaque PNGs, the extension).
 *
 * Format is preserved rather than blindly converted: a PNG that actually uses
 * its alpha channel stays a PNG, because flattening it onto JPEG would paint a
 * black box behind the subject. Opaque PNGs become JPEGs, which is where most
 * of the saving on the portraits comes from.
 *
 * `.rotate()` with no argument applies the EXIF orientation and then strips it,
 * matching optimise-photos.mjs.
 */
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ASSET_ROOT = path.join(process.cwd(), 'src/assets')
const OUTPUT_ROOT = path.join(ASSET_ROOT, 'optimised')
const MANIFEST = path.join(process.cwd(), 'scripts/optimised-manifest.json')

/** Big enough to stay crisp on a retina hero, small enough to stop the bleeding. */
const MAX_EDGE = 2560
const JPEG_QUALITY = 82
/** Below this, re-encoding buys less than it costs in churn. */
const MIN_BYTES = 500 * 1024

/** Already the output of optimise-photos.mjs — re-compressing would double-degrade. */
const SKIP_DIRS = new Set(['optimised', 'photos'])

async function walk(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      await walk(path.join(dir, entry.name), acc)
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      acc.push(path.join(dir, entry.name))
    }
  }
  return acc
}

// Only rewrite images something actually imports; the repo carries a lot of
// unreferenced originals that never reach the bundle.
async function referencedBasenames() {
  const sources = []
  const collect = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'assets') continue
        await collect(p)
      } else if (/\.(ts|tsx|css)$/.test(entry.name)) {
        sources.push(p)
      }
    }
  }
  await collect(path.join(process.cwd(), 'src'))
  const blob = (await Promise.all(sources.map((f) => readFile(f, 'utf8')))).join('\n')
  return (name) => blob.includes(name)
}

const isReferenced = await referencedBasenames()
const candidates = []
for (const file of await walk(ASSET_ROOT)) {
  if (!isReferenced(path.basename(file))) continue
  if ((await stat(file)).size < MIN_BYTES) continue
  candidates.push(file)
}
candidates.sort()

const manifest = {}
let originalBytes = 0
let outputBytes = 0

for (const from of candidates) {
  const rel = path.relative(ASSET_ROOT, from)
  const { alpha } = await sharp(from).stats()
  const isPng = /\.png$/i.test(from)
  // `stats().alpha` is 1 for a fully opaque alpha channel, so a PNG that never
  // uses its transparency can safely become a JPEG.
  const keepPng = isPng && alpha !== undefined && alpha < 1

  const outRel = keepPng ? rel : rel.replace(/\.(jpe?g|png)$/i, '.jpg')
  const to = path.join(OUTPUT_ROOT, outRel)
  await mkdir(path.dirname(to), { recursive: true })

  const pipeline = sharp(from)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })

  await (keepPng
    ? pipeline.png({ compressionLevel: 9, palette: true })
    : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
  ).toFile(to)

  const before = (await stat(from)).size
  const after = (await stat(to)).size
  originalBytes += before
  outputBytes += after

  // Keyed by basename: that is what the import-rewriter matches on.
  manifest[path.basename(from)] = {
    from: `assets/${rel.split(path.sep).join('/')}`,
    to: `assets/optimised/${outRel.split(path.sep).join('/')}`,
  }

  const pct = (100 - (after / before) * 100).toFixed(0)
  console.log(
    `${rel.padEnd(42)} ${(before / 1048576).toFixed(2)}MB -> ${(after / 1024).toFixed(0)}KB  (-${pct}%)`,
  )
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')

const mb = (bytes) => (bytes / 1048576).toFixed(1)
console.log(
  `\n${candidates.length} images: ${mb(originalBytes)}MB -> ${mb(outputBytes)}MB ` +
    `(${(100 - (outputBytes / originalBytes) * 100).toFixed(0)}% smaller)`,
)
console.log(`manifest -> ${path.relative(process.cwd(), MANIFEST)}`)
