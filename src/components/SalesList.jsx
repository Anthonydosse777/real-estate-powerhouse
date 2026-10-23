import { useMemo, useState } from 'react'
import { buildSalesUrl, normalizeSale } from '../api/salesApi.js'
import useFetch from '../hooks/useFetch.js'
import { formatNumber } from '../lib/format.js'
import EmptyState from './EmptyState.jsx'
import ErrorState from './ErrorState.jsx'
import SaleCard from './SaleCard.jsx'
import Skeleton from './Skeleton.jsx'

const SALES_URL = buildSalesUrl()
const PAGE_SIZE = 24

export default function SalesList() {
  const { data, loading, error, retry } = useFetch(SALES_URL)
  const sales = useMemo(() => (data ? data.map(normalizeSale) : []), [data])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Derived during render: only the count lives in state.
  const visibleSales = sales.slice(0, visibleCount)

  let content
  if (loading) {
    content = <Skeleton variant="sale" count={6} label="Loading sales…" />
  } else if (error) {
    content = <ErrorState title="Sales couldn't load" message={error} onRetry={retry} />
  } else if (sales.length === 0) {
    content = (
      <EmptyState
        title="No sales found"
        message="NYC Open Data returned no 2025 Staten Island sales over $10,000."
      />
    )
  } else {
    content = (
      <>
        <ul className="card-grid">
          {visibleSales.map((sale) => (
            <li key={sale.id}>
              <SaleCard sale={sale} />
            </li>
          ))}
        </ul>
        <div className="list-footer">
          <p className="list-footer__status" aria-live="polite">
            Showing {formatNumber(visibleSales.length)} of {formatNumber(sales.length)}
          </p>
          {visibleSales.length < sales.length && (
            <button
              type="button"
              className="button button--secondary"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            >
              Show more
            </button>
          )}
        </div>
      </>
    )
  }

  return (
    <section className="section" aria-labelledby="sales-heading">
      <div className="section__header">
        <h2 id="sales-heading" className="section__title">2025 sales</h2>
        {!loading && !error && (
          <p className="section__count">{formatNumber(sales.length)} sales</p>
        )}
      </div>
      {content}
    </section>
  )
}
