import { useState, useEffect } from 'react'

const SPLASH_KEY = 'dd_splash_v1'
const TARGET = 'deal detect'

const DEMO_STEPS = [
  { key: 'normaliseKeyword()',          label: 'Normalising keyword…',   value: '"rtx 4080 super"',       mono: true  },
  { key: 'findAveragePriceByKeyword()', label: 'Finding average price…', value: '$850',                   mono: false },
  { key: 'cutoff = avg × (1 − t/100)', label: 'Computing cutoff…',      value: '$850 × 0.85 = $722.50',  mono: true  },
  { key: 'price ≤ cutoff',             label: 'Evaluating price…',      value: '$650 ≤ $722.50',         mono: true  },
]

function AlgoDemo() {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)
  const isDone = step >= DEMO_STEPS.length

  function play() {
    setStep(0)
    setRunning(true)
  }

  function reset() {
    setStep(0)
    setRunning(false)
  }

  useEffect(() => {
    if (!running || step >= DEMO_STEPS.length) return
    const delay = step === 0 ? 480 : 760
    const t = setTimeout(() => setStep(s => s + 1), delay)
    return () => clearTimeout(t)
  }, [running, step])

  return (
    <div className="algo-demo">
      <div className="algo-demo-header">
        <p className="algo-eyebrow">// algorithm.execute()</p>
        <h2 className="algo-demo-title">Live execution trace</h2>
      </div>

      <div className="algo-demo-input">
        <span className="algo-demo-input-label">listing</span>
        <span className="algo-demo-input-val">RTX 4080 SUPER · $650 · New York</span>
      </div>

      <div className="algo-demo-steps">
        {step === 0 && !running && (
          <div className="algo-demo-placeholder">// press run to execute</div>
        )}
        {DEMO_STEPS.map((s, i) => i < step && (
          <div key={s.key} className="algo-demo-step">
            <span className="algo-demo-step-key">{s.key}</span>
            <span className={`algo-demo-step-val${s.mono ? ' mono' : ''}`}>{s.value}</span>
          </div>
        ))}
        {isDone && running && (
          <div className="algo-demo-verdict">
            → MATCH · $650 ≤ $722.50 · 24% below market · saves $200
          </div>
        )}
      </div>

      <div className="algo-demo-footer">
        {!running ? (
          <button className="algo-demo-play" onClick={play}>
            ▶&ensp;Run algorithm
          </button>
        ) : isDone ? (
          <button className="algo-demo-play algo-demo-play--reset" onClick={reset}>
            ↺&ensp;Reset
          </button>
        ) : (
          <div className="algo-demo-running">
            <span className="algo-demo-dot" />
            {DEMO_STEPS[step]?.label ?? '…'}
          </div>
        )}

        {!running && (
          <span className="algo-demo-footer-note">RTX 4080 SUPER · 15% threshold</span>
        )}
      </div>
    </div>
  )
}

function Home({ onAlgorithmClick, onWatchlistsClick }) {
  const hasSeenSplash = sessionStorage.getItem(SPLASH_KEY) === 'done'
  const [splashDone, setSplashDone] = useState(hasSeenSplash)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('typing') // 'typing' | 'done' | 'ready' | 'exit'

  useEffect(() => {
    if (hasSeenSplash) return

    let cancelled = false

    const schedule = (fn, delay) => setTimeout(() => { if (!cancelled) fn() }, delay)

    let i = 0
    const typeNext = () => {
      if (cancelled) return
      if (i < TARGET.length) {
        i++
        setText(TARGET.slice(0, i))
        schedule(typeNext, 75)
      } else {
        setPhase('done')
        schedule(() => {
          setPhase('ready')
          schedule(() => {
            setPhase('exit')
            schedule(() => {
              sessionStorage.setItem(SPLASH_KEY, 'done')
              setSplashDone(true)
            }, 450)
          }, 700)
        }, 600)
      }
    }

    schedule(typeNext, 300)
    return () => { cancelled = true }
  }, [])

  if (!splashDone) {
    return (
      <div className={`splash-screen${phase === 'exit' ? ' splash-exit' : ''}`}>
        <div className="splash-inner">
          <div className="splash-line">
            <span className="splash-prompt">$</span>
            <span className="splash-text">{text}</span>
            <span className={`splash-cursor${phase !== 'typing' ? ' splash-cursor-blink' : ''}`}>_</span>
          </div>
          {(phase === 'ready' || phase === 'exit') && (
            <div className="splash-ready">// initialized</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="overview-page page-enter">
      <div className="overview-left">
        <div className="overview-header">
          <h1 className="overview-title">Deal Detect</h1>
          <p className="overview-desc">
            A market-aware deal matching engine built on Spring Boot. Create watchlists,
            set discount thresholds, and let the algorithm surface underpriced listings automatically.
          </p>
          <div className="overview-actions">
            <button className="button-primary" onClick={onAlgorithmClick}>Algorithm explorer</button>
            <button className="button-secondary" onClick={onWatchlistsClick}>View watchlists</button>
          </div>
        </div>

        <div className="overview-grid">
          <div className="overview-card">
            <div className="overview-card-label">01 — Watchlists</div>
            <h3 className="overview-card-title">Keyword tracking</h3>
            <p className="overview-card-desc">
              Create watchlists for keywords you care about. Each has a configurable discount
              threshold the engine filters against.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-label">02 — Matching</div>
            <h3 className="overview-card-title">Market-aware scoring</h3>
            <p className="overview-card-desc">
              Listings are scored against the live average price for their keyword — not a fixed
              value. The cutoff shifts with the market.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-label">03 — Algorithm</div>
            <h3 className="overview-card-title">Transparent engine</h3>
            <p className="overview-card-desc">
              The matching logic mirrors{' '}
              <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.8em' }}>
                DealMatchingService.java
              </code>{' '}
              directly. Explore it interactively in the Algorithm tab.
            </p>
          </div>
        </div>

        <div className="overview-system">
          <div className="overview-system-title">Stack</div>
          <div className="overview-system-rows">
            <div className="overview-system-row">
              <span className="overview-system-key">Backend</span>
              <span className="overview-system-val">Spring Boot · Java</span>
            </div>
            <div className="overview-system-row">
              <span className="overview-system-key">Authentication</span>
              <span className="overview-system-val">JWT Bearer tokens</span>
            </div>
            <div className="overview-system-row">
              <span className="overview-system-key">Matching engine</span>
              <span className="overview-system-val">DealMatchingService.java</span>
            </div>
            <div className="overview-system-row">
              <span className="overview-system-key">Listings source</span>
              <span className="overview-system-val">Facebook Marketplace scraper · paginated</span>
            </div>
            <div className="overview-system-row">
              <span className="overview-system-key">Frontend</span>
              <span className="overview-system-val">React · Vite · vanilla CSS</span>
            </div>
          </div>
        </div>
      </div>

      <AlgoDemo />
    </div>
  )
}

export default Home
