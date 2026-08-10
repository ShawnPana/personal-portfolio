import { lazy, Suspense, useCallback, useEffect, useState } from 'react'

const AVATAR = '/avatar.png'

// three.js lives in its own chunk and only loads when WebGL is actually available.
const ShawnModel = lazy(() => import('./ShawnModel.jsx'))

function webGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export default function App() {
  // The GitHub photo is the fallback: shown until the 3D model actually renders,
  // and brought back if the model ever fails.
  const [show3D, setShow3D] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  useEffect(() => {
    if (!webGLAvailable()) return
    // Defer loading three.js until the browser is idle so the text/content
    // paints first and the 3D bundle never competes on the critical path.
    const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 300))
    const cancel = window.cancelIdleCallback || clearTimeout
    const id = schedule(() => setShow3D(true))
    return () => cancel(id)
  }, [])
  const handleFail = useCallback(() => {
    setShow3D(false)
    setModelReady(false)
  }, [])
  const handleReady = useCallback(() => setModelReady(true), [])

  return (
    <main className="page">
      <header className="topbar">
        <div className="portrait">
          <img
            className={`avatar${modelReady ? ' avatar-hidden' : ''}`}
            src={AVATAR}
            alt="Shawn Pana"
            width="200"
            height="200"
          />
          {show3D && (
            <Suspense fallback={null}>
              <ShawnModel onFail={handleFail} onReady={handleReady} />
            </Suspense>
          )}
        </div>

        <div className="id">
          <h1>Shawn Pana</h1>
          <a className="handle" href="https://x.com/shawn_pana" aria-label="@shawn_pana on X">
            <svg className="handle-x" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.83L1.24 2.25h6.83l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" />
            </svg>
            @shawn_pana
          </a>
        </div>
      </header>

      <div className="story">
        <p>
          I studied Mathematics-Computer Science and Music at{' '}
          <a href="https://www.ucsd.edu">UC San Diego</a>, won a few{' '}
          <a href="https://devpost.com/ShawnPana">hackathons</a>, and led growth at{' '}
          <a href="https://browser-use.com">Browser Use (YC W25)</a>.
        </p>

        <div className="projects">
          <span className="projects-label">Some notable projects of mine:</span>
          <p className="project">
            <a href="https://github.com/ShawnPana/smux">smux</a> — a tmux config with built-in
            terminal automation and agent-to-agent communication.
          </p>
          <p className="project">
            <a href="https://phone-harness.com/?utm_source=personal-portfolio&utm_campaign=phone-harness-hyperlink">
              phone-harness
            </a>{' '}
            — a harness that lets AI agents control a real iPhone.
          </p>
          <p className="project">
            <a href="https://github.com/browser-use/browser-use">browser-use</a> — the open-source
            library that lets AI agents control a browser.
          </p>
        </div>

        <p>
          I also make music in{' '}
          <a className="conrad" href="https://open.spotify.com/artist/62cEXgXJDt2FSXsUrUqIOt">
            Conrad Ave
          </a>{' '}
          and{' '}
          <a className="threadbare" href="https://open.spotify.com/artist/41KKMPcJdhwlRk9syrfaP6">
            Threadbare
          </a>
          .
        </p>
      </div>

      <footer className="socials">
        <div className="social-links">
          <a href="mailto:shawn@browser-use.com" aria-label="Email" title="Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
              <path d="m3 6 9 6 9-6" />
            </svg>
          </a>
          <a href="https://github.com/ShawnPana" aria-label="GitHub" title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/shawnpana/" aria-label="LinkedIn" title="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
            </svg>
          </a>
          <a href="https://x.com/shawn_pana" aria-label="X" title="X">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.83L1.24 2.25h6.83l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" />
            </svg>
          </a>
        </div>
        <span className="signoff">— Shawn</span>
      </footer>
    </main>
  )
}
