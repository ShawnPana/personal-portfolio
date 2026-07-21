# Personal Portfolio

Shawn Pana's personal portfolio — a single-page site built with React + Vite, deployed on Vercel.

The homepage shows a rotating 3D model when the browser supports WebGL, and falls
back to a static avatar everywhere else, so it renders reliably on every device.

## Editing content

The page is a single component — edit the copy, links, and project list directly in
[`src/App.jsx`](src/App.jsx). SEO/meta, structured data, and the `<noscript>` fallback
live in [`index.html`](index.html); the AI-agent summary is in [`public/llms.txt`](public/llms.txt).

## Development

```bash
npm install
npm run dev      # local dev server (http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Deployment

Deployed automatically via Vercel on push to `main`. Config in `vercel.json`.

## Archive

The previous Three.js-heavy version (with the `/Home` and `/tree` interactive
scenes) is preserved on the `archive/3d-original` branch.
