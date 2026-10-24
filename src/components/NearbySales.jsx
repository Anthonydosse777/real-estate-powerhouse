import { formatCurrency, formatDate, formatPricePerSqft } from '../lib/format.js'
import { getMedian, getPricePerSqft } from '../lib/stats.js'
import EmptyState from './EmptyState.jsx'
import ErrorState from './ErrorState.jsx'
import Skeleton from './Skeleton.jsx'

// result is the useFetch result; sales are its rows, already normalized.
export default function NearbySales({ result, sales }) {
  let content
  if (result.loading) {
    content = <Skeleton variant="row" count={4} label="Loading nearby sales…" />
  } else if (result.error) {
    content = <ErrorState title="Nearby sales couldn't load" message={result.error} onRetry={result.retry} />
  } else if (sales.length === 0) {
    content = (
      <EmptyState
        title="No similar sales nearby in 2025"
        message="No other sales of this property type were recorded within about half a mile."
      />
    )
  } else {
    content = (
      <>
        <p className="detail__summary">
          Median of nearby sales: <strong>{formatCurrency(getMedian(sales.map((nearby) => nearby.price)))}</strong>
        </p>
        <ul className="compact-list">
          {sales.map((nearby) => (
            <li key={nearby.id} className="compact-row">
              <span className="compact-row__main">
                {nearby.address}
                {nearby.unit && `, Unit ${nearby.unit}`}
              </span>
              <span className="compact-row__price">{formatCurrency(nearby.price)}</span>
              <span className="compact-row__meta">
                <time dateTime={nearby.date}>{formatDate(nearby.date)}</time>
                {nearby.grossSqft !== null && ` · ${formatPricePerSqft(getPricePerSqft(nearby))}`}
              </span>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <section className="detail__section" aria-labelledby="nearby-heading">
      <h3 id="nearby-heading" className="detail__section-title">Comparable sales nearby</h3>
      <p className="detail__section-intro">Same property type, within about half a mile, newest first.</p>
      {content}
    </section>
  )
}
