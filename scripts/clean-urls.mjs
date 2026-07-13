// Post-process the Magidoc build for static hosts that serve files literally
// and do NOT map a clean URL (/path/page) to its .html file — notably
// DigitalOcean App Platform, which serves docs.flashapp.me. Magidoc links and
// its root redirect use extensionless URLs (/guides/introduction), so without
// this every page 404s on DO.
//
// For each `X.html` (except index.html), also emit `X/index.html`, so a request
// for `/…/X` resolves as a directory index. Both `/…/X` and `/…/X.html` then work.
import { readdirSync, statSync, mkdirSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'public'

let created = 0
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) {
      walk(p)
    } else if (entry.endsWith('.html') && entry !== 'index.html') {
      const base = p.slice(0, -'.html'.length)
      mkdirSync(base, { recursive: true })
      copyFileSync(p, join(base, 'index.html'))
      created++
    }
  }
}

walk(ROOT)
console.log(`clean-urls: generated ${created} directory index pages`)
