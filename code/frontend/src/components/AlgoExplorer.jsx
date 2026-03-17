import { useState, useEffect, useRef } from 'react'
import Listing from './Listing'

const DEFAULT_JSON = `{
  "keyword": "RTX 4080 SUPER",
  "title": "RTX 4080 SUPER 16GB",
  "price": 650,
  "marketAverage": 850,
  "percentageThreshold": 15,
  "location": "Sydney, NSW"
}`

function AlgoExplorer() {
  const [input, setInput] = useState(DEFAULT_JSON)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const sectionRef = useRef(null)

  // Immersive focus: dim everything else while this section is in view
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => document.body.classList.toggle('algo-focus', entry.isIntersecting),
      { threshold: 0.72, rootMargin: '-80px 0px -80px 0px' }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      document.body.classList.remove('algo-focus')
    }
  }, [])

  // Mirrors DealMatchingService.findMatchesInternal exactly
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const parsed = JSON.parse(input)

        const price = Number(parsed.price)
        const marketAverage = parsed.marketAverage != null ? Number(parsed.marketAverage) : null
        const percentageThreshold = parsed.percentageThreshold != null ? Number(parsed.percentageThreshold) : null
        const keyword = parsed.keyword ? String(parsed.keyword).trim().toLowerCase() : null

        if (!parsed.price || isNaN(price) || price <= 0) {
          setError('"price" must be a positive number')
          setResult(null)
          return
        }

        if (percentageThreshold !== null && (isNaN(percentageThreshold) || percentageThreshold < 1 || percentageThreshold > 90)) {
          setError('"percentageThreshold" must be between 1 and 90')
          setResult(null)
          return
        }

        if (marketAverage !== null && (isNaN(marketAverage) || marketAverage <= 0)) {
          setError('"marketAverage" must be a positive number')
          setResult(null)
          return
        }

        // cutoff = avg * (1 - percentageThreshold / 100.0)
        // listing qualifies if price <= cutoff
        let cutoff = null
        let isDeal = false
        let discountPercentage = null
        let savings = null

        if (marketAverage && marketAverage > 0) {
          if (percentageThreshold !== null) {
            cutoff = marketAverage * (1 - percentageThreshold / 100)
            isDeal = price <= cutoff
          }
          if (isDeal && price < marketAverage) {
            discountPercentage = Math.round(((marketAverage - price) / marketAverage) * 100)
            savings = marketAverage - price
          }
        }

        setResult({
          keyword,
          title: parsed.title || 'Untitled listing',
          price,
          marketAverage,
          percentageThreshold,
          cutoff,
          isDeal,
          discountPercentage,
          savings,
          location: parsed.location || null,
        })
        setError(null)
      } catch (e) {
        setError(e.message)
        setResult(null)
      }
    }, 280)

    return () => clearTimeout(timer)
  }, [input])

  const hasMarketAvg = result?.marketAverage != null && result.marketAverage > 0
  const hasThreshold = result?.percentageThreshold != null

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart, selectionEnd, value } = e.target
      const next = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd)
      setInput(next)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 2
      })
    }
  }

  return (
    <section className="algo-explorer" ref={sectionRef}>
      <div className="algo-explorer-header">
        <p className="algo-eyebrow">// algorithm explorer</p>
        <h2 className="algo-title">Watch the deal engine evaluate a listing</h2>
        <p className="algo-sub">
          Paste any listing as JSON. The detection logic runs live — this is the exact algorithm the backend executes.
        </p>
      </div>

      <div className="algo-context-ref">
        <span className="algo-context-file">DealMatchingService.java</span>
        <span className="algo-context-method">findMatchesInternal(keyword, percentageThreshold, pageable)</span>
      </div>

      <div className="algo-grid">
        <div className="algo-input-panel">
          <div className="algo-editor-wrap">
            <div className="algo-editor-bar">
              <div className="algo-editor-tab">
                <span className="algo-editor-filename">listing.json</span>
              </div>
              <div className="algo-editor-spacer" />
              <div className="algo-editor-right">
                <span className="algo-editor-lang">JSON</span>
                <span className={`algo-parse-status ${error ? 'algo-parse-error' : 'algo-parse-ok'}`}>
                  {error ? '✕' : '✓'}
                </span>
              </div>
            </div>
            <textarea
              className="algo-textarea"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
            />
          </div>
          {error && <p className="algo-error-msg">{error}</p>}
        </div>

        <div className="algo-output-panel">
          {result ? (
            <>
              <div className="algo-steps">
                {result.keyword && (
                  <div className="algo-step">
                    <span className="algo-step-key">normaliseKeyword</span>
                    <span className="algo-step-val algo-step-mono">"{result.keyword}"</span>
                  </div>
                )}

                <div className="algo-step">
                  <span className="algo-step-key">price</span>
                  <span className="algo-step-val">${result.price.toLocaleString()}</span>
                </div>

                {hasMarketAvg ? (
                  <>
                    <div className="algo-step">
                      <span className="algo-step-key">findAveragePriceByKeyword</span>
                      <span className="algo-step-val">${result.marketAverage.toLocaleString()}</span>
                    </div>

                    {hasThreshold && (
                      <>
                        <div className="algo-step">
                          <span className="algo-step-key">percentageThreshold</span>
                          <span className="algo-step-val">{result.percentageThreshold}%</span>
                        </div>

                        <div className="algo-step">
                          <span className="algo-step-key">cutoff = avg × (1 − t/100)</span>
                          <span className="algo-step-val algo-step-mono">
                            {result.marketAverage} × (1 − {(result.percentageThreshold / 100).toFixed(2)}) = ${result.cutoff.toFixed(2)}
                          </span>
                        </div>

                        <div className="algo-step">
                          <span className="algo-step-key">price ≤ cutoff</span>
                          <span className={`algo-step-val ${result.isDeal ? 'algo-val-deal' : 'algo-val-nodeal'}`}>
                            ${result.price.toLocaleString()} {result.isDeal ? '≤' : '>'} ${result.cutoff.toFixed(2)} → {result.isDeal ? 'true' : 'false'}
                          </span>
                        </div>
                      </>
                    )}

                    {result.isDeal && result.discountPercentage > 0 && (
                      <div className="algo-step">
                        <span className="algo-step-key">discountPercentage</span>
                        <span className="algo-step-val algo-val-deal">
                          {result.discountPercentage}%
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="algo-step">
                    <span className="algo-step-key">findAveragePriceByKeyword</span>
                    <span className="algo-step-val algo-val-missing">null → returns empty</span>
                  </div>
                )}

                <div className={`algo-verdict ${
                  result.isDeal
                    ? 'algo-verdict--deal'
                    : !hasMarketAvg || !hasThreshold
                      ? 'algo-verdict--unknown'
                      : 'algo-verdict--nodeal'
                }`}>
                  {result.isDeal
                    ? `→ MATCH: $${result.price.toLocaleString()} ≤ cutoff $${result.cutoff.toFixed(2)} (${result.discountPercentage}% below market)`
                    : !hasMarketAvg
                      ? '→ NO MATCH: marketAverage null — returns empty response'
                      : !hasThreshold
                        ? '→ INCOMPLETE: percentageThreshold not provided'
                        : `→ NO MATCH: $${result.price.toLocaleString()} > cutoff $${result.cutoff.toFixed(2)}`}
                </div>
              </div>

              <Listing
                title={result.title}
                price={result.price}
                location={result.location}
                url="#"
                marketAverage={result.marketAverage}
                discountPercentage={result.discountPercentage}
                savings={result.savings}
              />
            </>
          ) : (
            <div className="algo-placeholder">
              // enter valid JSON to run detection
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AlgoExplorer
