// Build-time prerender: render <App/> to static HTML and inject it into the
// built dist/index.html so crawlers and AI agents get the full content in the
// initial response (no JS-render-queue wait). Runs after `vite build`.
import { createServer } from 'vite'
import { readFileSync, writeFileSync } from 'node:fs'
import React from 'react'
import { renderToString } from 'react-dom/server'

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'warn',
})

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
  const appHtml = renderToString(React.createElement(App))

  const file = 'dist/index.html'
  const template = readFileSync(file, 'utf8')
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('Prerender failed: <div id="root"></div> not found in dist/index.html')
  }
  const out = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  writeFileSync(file, out)
  console.log(`Prerendered ${appHtml.length} chars into ${file}`)
} finally {
  await vite.close()
}
