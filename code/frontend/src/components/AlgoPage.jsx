import AlgoExplorer from './AlgoExplorer'
import AlgoMap from './AlgoMap'

const STEPS = [
  {
    n: '01',
    method: 'normaliseKeyword(keyword)',
    desc: 'Trim + lowercase. Blank keywords throw BadRequestException and are rejected immediately.',
  },
  {
    n: '02',
    method: 'findAveragePriceByKeyword(key)',
    desc: 'Query the database for the average price across all listings matching the keyword. If null or ≤ 0, an empty response is returned — no cutoff computed.',
  },
  {
    n: '03',
    method: 'cutoff = avg × (1 − threshold / 100)',
    desc: 'The cutoff price is derived from the market average and the watchlist\'s percentage threshold. threshold must be between 1 and 90.',
  },
  {
    n: '04',
    method: 'price ≤ cutoff',
    desc: 'Each listing is returned only if its price is at or below the cutoff. Results are paginated via Spring\'s Pageable.',
  },
]

function AlgoPage() {
  return (
    <div className="algo-page page-enter">
      <div className="algo-page-intro">
        <p className="algo-eyebrow">// DealMatchingService.java</p>
        <h1 className="algo-page-title">How the algorithm works</h1>
        <p className="algo-page-desc">
          Every watchlist match runs through four stages. Explore the engine interactively below,
          or read the breakdown first.
        </p>

        <div className="algo-overview-steps">
          {STEPS.map(step => (
            <div className="algo-overview-step" key={step.n}>
              <span className="algo-overview-n">{step.n}</span>
              <div>
                <strong>{step.method}</strong>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AlgoExplorer />
      <AlgoMap />
    </div>
  )
}

export default AlgoPage
