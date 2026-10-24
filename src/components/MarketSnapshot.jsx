import { useMemo } from 'react'
import { buildMarketSnapshotUrl, normalizeNeighborhoodStat, TYPICAL_PRICE_LABEL } from '../api/salesApi.js'
import useFetch from '../hooks/useFetch.js'
import { formatNumber, formatShortCurrency } from '../lib/format.js'
import EmptyState from './EmptyState.jsx'
import ErrorState from './ErrorState.jsx'
import Skeleton from './Skeleton.jsx'
import './MarketSnapshot.css'

const SNAPSHOT_URL = buildMarketSnapshotUrl()

export default function MarketSnapshot() {
  const { data, loading, error, retry } = useFetch(SNAPSHOT_URL)
  const stats = useMemo(() => (data ? data.map(normalizeNeighborhoodStat) : []), [data])

  let content
  if (loading) {
    content = <Skeleton variant="stat" count={6} label="Loading market snapshot…" />
  } else if (error) {
    content = <ErrorState title="Market snapshot unavailable" message={error} onRetry={retry} />
  } else if (stats.length === 0) {
    content = (
      <EmptyState
        title="No neighborhood data yet"
        message="NYC Open Data returned no 2025 sales for Staten Island neighborhoods."
      />
    )
  } else {
    content = (
      <div className="stat-scroller" tabIndex={0} role="region" aria-label="Busiest neighborhoods">
        <ul className="stat-grid">
          {stats.map((stat) => (
            <li key={stat.neighborhood} className="card stack stat-card">
              <h3 className="stat-card__name">{stat.neighborhood}</h3>
              <dl className="text-meta stat-card__figures">
                <div>
                  <dt>Sales</dt>
                  <dd className="stat-card__value">{formatNumber(stat.salesCount)}</dd>
                </div>
                <div>
                  <dt>{TYPICAL_PRICE_LABEL}</dt>
                  <dd className="stat-card__value stat-card__value--gold">
                    {stat.typicalPrice === null ? 'No home sales' : formatShortCurrency(stat.typicalPrice)}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <section className="section" aria-labelledby="snapshot-heading">
      <div className="stack stack--tight section__header">
        <h2 id="snapshot-heading" className="section__title">Market snapshot</h2>
        <p className="text-meta section__intro">
          The Staten Island neighborhoods with the most sales in 2025. {TYPICAL_PRICE_LABEL} covers
          one- to three-family homes, condos, and co-ops.
        </p>
      </div>
      {content}
    </section>
  )
}
