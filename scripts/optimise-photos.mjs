/**
 * One-off: produce web-sized copies of the camera originals.
 *
 *   node scripts/optimise-photos.mjs
 *
 * Reads src/assets/images/IMG_*.jpeg (multi-megabyte phone photos) and writes
 * ~2000px, quality-80 JPEGs to src/assets/photos/. Originals are never touched.
 *
 * `.rotate()` with no argument applies the EXIF orientation and then strips it,
 * so photos that were stored sideways come out upright rather than relying on
 * every consumer to honour the EXIF flag.
 */
import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE_DIR = path.join(process.cwd(), 'src/assets/images')
const OUTPUT_DIR = path.join(process.cwd(), 'src/assets/photos')
const MAX_EDGE = 2000
const QUALITY = 80

const files = (await readdir(SOURCE_DIR)).filter((name) => /^IMG_.*\.jpe?g$/i.test(name))

await mkdir(OUTPUT_DIR, { recursive: true })

let originalBytes = 0
let outputBytes = 0

for (const name of files) {
  const from = path.join(SOURCE_DIR, name)
  // Normalise the name: IMG_6516.jpeg -> img-6516.jpg, "IMG_2915 (1)" -> img-2915-1
  const slug = name
    .replace(/\.jpe?g$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const to = path.join(OUTPUT_DIR, `${slug}.jpg`)

  originalBytes += (await stat(from)).size

  await sharp(from)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(to)

  const { size } = await stat(to)
  outputBytes += size
  const meta = await sharp(to).metadata()
  console.log(`${name} -> ${slug}.jpg  ${meta.width}x${meta.height}  ${(size / 1024).toFixed(0)}KB`)
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1)
console.log(
  `\n${files.length} photos: ${mb(originalBytes)}MB -> ${mb(outputBytes)}MB ` +
    `(${(100 - (outputBytes / originalBytes) * 100).toFixed(0)}% smaller)`,
)
