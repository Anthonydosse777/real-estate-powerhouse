import { useMemo, useState } from 'react'
import { buildSalesUrl, normalizeSale } from '../api/salesApi.js'
import useFetch from '../hooks/useFetch.js'
import { DEFAULT_FILTERS, filterSales, getNeighborhoods, hasActiveFilters, sortSales } from '../lib/filterSales.js'
import { formatNumber } from '../lib/format.js'
import EmptyState from './EmptyState.jsx'
import ErrorState from './ErrorState.jsx'
import PropertyDetail from './PropertyDetail.jsx'
import SaleCard from './SaleCard.jsx'
import SalesFilters from './SalesFilters.jsx'
import Skeleton from './Skeleton.jsx'

const SALES_URL = buildSalesUrl()
const PAGE_SIZE = 24

export default function SalesList() {
  const { data, loading, error, retry } = useFetch(SALES_URL)
  const sales = useMemo(() => (data ? data.map(normalizeSale) : []), [data])
  const neighborhoods = useMemo(() => getNeighborhoods(sales), [sales])

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sortBy, setSortBy] = useState('newest')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [selectedId, setSelectedId] = useState(null)

  // Derived view: computed from the fetched list on every render, never stored.
  const matchingSales = sortSales(filterSales(sales, filters), sortBy)
  const visibleSales = matchingSales.slice(0, visibleCount)
  const selectedSale = sales.find((sale) => sale.id === selectedId) ?? null
  const filtersActive = hasActiveFilters(filters)

  // Changing what's listed starts the list over at the first page.
  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
    setVisibleCount(PAGE_SIZE)
  }

  function handleSortChange(value) {
    setSortBy(value)
    setVisibleCount(PAGE_SIZE)
  }

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS)
    setVisibleCount(PAGE_SIZE)
  }

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
        <SalesFilters
          filters={filters}
          sortBy={sortBy}
          neighborhoods={neighborhoods}
          showClear={filtersActive}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onClear={handleClearFilters}
        />
        <p className="results-status" aria-live="polite">
          Showing {formatNumber(matchingSales.length)} of {formatNumber(sales.length)} sales
        </p>
        {matchingSales.length === 0 ? (
          <EmptyState
            title="No sales match these filters"
            message="Try a different address or ZIP, or widen the neighborhood, type, or price."
            actionLabel="Clear filters"
            onAction={handleClearFilters}
          />
        ) : (
          <>
            <ul className="card-grid">
              {visibleSales.map((sale) => (
                <li key={sale.id}>
                  <SaleCard sale={sale} onOpen={setSelectedId} />
                </li>
              ))}
            </ul>
            <div className="list-footer">
              <p className="list-footer__status">
                Listing {formatNumber(visibleSales.length)} of {formatNumber(matchingSales.length)}
              </p>
              {visibleSales.length < matchingSales.length && (
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
        )}
      </>
    )
  }

  return (
    <section className="section" aria-labelledby="sales-heading">
      <div className="section__header">
        <h2 id="sales-heading" className="section__title">2025 sales</h2>
      </div>
      {content}
      <PropertyDetail sale={selectedSale} onClose={() => setSelectedId(null)} />
    </section>
  )
}
