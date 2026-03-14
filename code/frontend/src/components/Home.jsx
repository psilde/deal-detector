import { useEffect } from 'react'
import { Activity, Search, BellRing, ArrowRight } from 'lucide-react'

function Home({ token, onBrowseClick, onWatchlistsClick, onSelectLogin, onSelectRegister }) {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -80px 0px'
      }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="home-page">
      <section className="hero-section page-enter">
        <div className="hero-copy">
          <div className="hero-badge">Smarter deal tracking</div>

          <h1 className="hero-title">
            Find the best online deals
            <span className="hero-accent">before everyone else</span>
          </h1>

          <p className="hero-subtitle">
            Search listings, build watchlists, and spot underpriced items through a cleaner,
            focused dashboard built for fast scanning.
          </p>

          <div className="hero-actions">
            {token ? (
              <>
                <button className="button-primary hero-button" onClick={onBrowseClick}>
                  Browse listings
                </button>

                <button className="button-secondary hero-button" onClick={onWatchlistsClick}>
                  View watchlists
                </button>
              </>
            ) : (
              <>
                <button className="button-primary hero-button" onClick={onSelectRegister}>
                  Get started
                </button>

                <button className="button-secondary hero-button" onClick={onSelectLogin}>
                  Log in
                </button>
              </>
            )}
          </div>

          <div className="hero-meta">
            <span>Track products you care about</span>
            <span>Search instantly</span>
            <span>Spot better-value listings</span>
          </div>
        </div>

        <div className="hero-side">
          <div className="hero-preview panel">
            <div className="preview-header">
              <div>
                <p className="preview-label">Live preview</p>
                <h3>Deal activity</h3>
              </div>
              <span className="preview-pill">Updated</span>
            </div>

            <div className="preview-list">
              <div className="preview-item">
                <div className="preview-item-left">
                  <div className="preview-icon-chip">
                    <Activity size={14} strokeWidth={2.2} />
                  </div>

                  <div>
                    <strong>RTX 4080 SUPER 16GB</strong>
                    <p>Watchlist match • 14% below average</p>
                  </div>
                </div>
                <span className="preview-price">$2,727</span>
              </div>

              <div className="preview-item">
                <div className="preview-item-left">
                  <div className="preview-icon-chip">
                    <Search size={14} strokeWidth={2.2} />
                  </div>

                  <div>
                    <strong>iPhone 15 Pro Max 256GB</strong>
                    <p>Keyword search • recently added</p>
                  </div>
                </div>
                <span className="preview-price">$1,887</span>
              </div>

              <div className="preview-item">
                <div className="preview-item-left">
                  <div className="preview-icon-chip">
                    <BellRing size={14} strokeWidth={2.2} />
                  </div>

                  <div>
                    <strong>Nissan GT-R 2022</strong>
                    <p>Tracked listing • price movement detected</p>
                  </div>
                </div>
                <span className="preview-price">$70,810</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section reveal">
        <div className="section-heading">
          <h2>How it works</h2>
          <p>A simple workflow designed around finding value quickly.</p>
        </div>

        <div className="feature-grid">
          <article className="feature-card panel reveal-step step-1">
            <div className="feature-icon">01</div>
            <h3>Browse listings</h3>
            <p>
              Search through items quickly with a cleaner interface designed for scanning and filtering.
            </p>
          </article>

          <article className="feature-card panel reveal-step step-2">
            <div className="feature-icon">02</div>
            <h3>Create watchlists</h3>
            <p>
              Save keywords and discount thresholds so you can focus on the items that matter most.
            </p>
          </article>

          <article className="feature-card panel reveal-step step-3">
            <div className="feature-icon">03</div>
            <h3>Track value</h3>
            <p>
              Pull matching deals into one place instead of manually checking listing sites all day.
            </p>
          </article>
        </div>
      </section>

      <section className="home-band reveal">
        <div className="home-band-copy">
          <p className="home-band-label">Why people use it</p>
          <h2>Less noise. Faster deal hunting.</h2>
          <p>
            Deal Detection helps you move from endless browsing to focused tracking, filtering, and action.
          </p>
        </div>

        <div className="home-stats">
          <div className="home-stat panel">
            <strong>Search faster</strong>
            <span>Focused keyword browsing</span>
          </div>

          <div className="home-stat panel">
            <strong>Track smarter</strong>
            <span>Watchlists built around price drops</span>
          </div>

          <div className="home-stat panel">
            <strong>Stay organized</strong>
            <span>One place for matching deals</span>
          </div>
        </div>
      </section>

      <section className="cta-strip panel reveal">
        <div>
          <h2>Ready to start tracking deals?</h2>
          <p>
            {token
              ? 'Jump into browsing or open your watchlists.'
              : 'Create an account and start tracking listings in a cleaner workflow.'}
          </p>
        </div>

        <div className="cta-strip-actions">
          {token ? (
            <>
              <button className="button-primary" onClick={onBrowseClick}>
                <span>Go to browse</span>
                <ArrowRight size={15} strokeWidth={2.3} />
              </button>

              <button className="button-secondary" onClick={onWatchlistsClick}>
                Open watchlists
              </button>
            </>
          ) : (
            <>
              <button className="button-primary" onClick={onSelectRegister}>
                <span>Create account</span>
                <ArrowRight size={15} strokeWidth={2.3} />
              </button>

              <button className="button-secondary" onClick={onSelectLogin}>
                Log in
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home