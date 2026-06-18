import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const BASE = '/band-of-agents-demo'
const OUT = join(import.meta.dirname, '..', 'out')
const START_PORT = Number(process.env.PORT || 3000)
const MAX_PORT = START_PORT + 10

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

const server = createServer((req, res) => {
  let pathname = req.url?.split('?')[0] ?? '/'

  if (!pathname.startsWith(BASE)) {
    res.writeHead(302, { Location: `${BASE}/` })
    res.end()
    return
  }

  let filePath = pathname.slice(BASE.length) || '/'
  if (filePath.endsWith('/')) filePath += 'index.html'

  const absolute = join(OUT, filePath)

  if (!absolute.startsWith(OUT) || !existsSync(absolute) || statSync(absolute).isDirectory()) {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  const ext = extname(absolute)
  res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' })
  res.end(readFileSync(absolute))
})

let port = START_PORT

function start() {
  server.listen(port, () => {
    console.log(`Preview: http://localhost:${port}${BASE}/`)
    if (port !== START_PORT) {
      console.log(`(Port ${START_PORT} was busy, using ${port} instead.)`)
    }
  })
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE' && !process.env.PORT && port < MAX_PORT) {
    port += 1
    start()
    return
  }

  console.error(`Failed to start preview server: ${err.message}`)
  process.exit(1)
})

start()
