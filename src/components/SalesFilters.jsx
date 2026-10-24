import { PROPERTY_GROUPS } from '../api/salesApi.js'
import { PRICE_RANGES, SORT_OPTIONS } from '../lib/filterSales.js'
import './SalesFilters.css'

export default function SalesFilters({ filters, sortBy, neighborhoods, showClear, onFilterChange, onSortChange, onClear }) {
  return (
    <form className="filters" role="search" aria-label="Filter sales" onSubmit={(event) => event.preventDefault()}>
      <div className="filters__field filters__field--search">
        <label className="filters__label" htmlFor="filter-search">Search address or ZIP</label>
        <input
          id="filter-search"
          className="filters__control"
          type="search"
          autoComplete="off"
          value={filters.search}
          onChange={(event) => onFilterChange('search', event.target.value)}
        />
      </div>

      <div className="filters__field">
        <label className="filters__label" htmlFor="filter-neighborhood">Neighborhood</label>
        <select
          id="filter-neighborhood"
          className="filters__control filters__control--select"
          value={filters.neighborhood}
          onChange={(event) => onFilterChange('neighborhood', event.target.value)}
        >
          <option value="">All neighborhoods</option>
          {neighborhoods.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="filters__field">
        <label className="filters__label" htmlFor="filter-group">Property type</label>
        <select
          id="filter-group"
          className="filters__control filters__control--select"
          value={filters.propertyGroup}
          onChange={(event) => onFilterChange('propertyGroup', event.target.value)}
        >
          <option value="">All types</option>
          {PROPERTY_GROUPS.map((group) => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>

      <div className="filters__field">
        <label className="filters__label" htmlFor="filter-price">Price</label>
        <select
          id="filter-price"
          className="filters__control filters__control--select"
          value={filters.priceRange}
          onChange={(event) => onFilterChange('priceRange', event.target.value)}
        >
          {PRICE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      <div className="filters__field">
        <label className="filters__label" htmlFor="filter-sort">Sort</label>
        <select
          id="filter-sort"
          className="filters__control filters__control--select"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {showClear && (
        <button type="button" className="button button--secondary filters__clear" onClick={onClear}>
          Clear filters
        </button>
      )}
    </form>
  )
}
