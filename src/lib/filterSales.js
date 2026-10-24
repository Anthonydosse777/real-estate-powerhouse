// Pure functions for the sales list's derived view. None of them change their inputs.

export const PRICE_RANGES = [
  { value: 'any', label: 'Any price', min: 0, max: Infinity },
  { value: 'under-500k', label: 'Under $500K', min: 0, max: 500000 },
  { value: '500k-750k', label: '$500K–$750K', min: 500000, max: 750000 },
  { value: '750k-1m', label: '$750K–$1M', min: 750000, max: 1000000 },
  { value: '1m-2m', label: '$1M–$2M', min: 1000000, max: 2000000 },
  { value: '2m-plus', label: '$2M+', min: 2000000, max: Infinity },
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'price-low', label: 'Price: low to high' },
]

// An empty string means "all" for neighborhood and property group.
export const DEFAULT_FILTERS = {
  search: '',
  neighborhood: '',
  propertyGroup: '',
  priceRange: 'any',
}

export function hasActiveFilters(filters) {
  return Object.keys(DEFAULT_FILTERS).some((key) => filters[key] !== DEFAULT_FILTERS[key])
}

// Lowercase, trimmed, with runs of spaces collapsed to one.
function normalizeText(text) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ')
}

export function filterSales(sales, filters) {
  const query = normalizeText(filters.search)
  const range = PRICE_RANGES.find((option) => option.value === filters.priceRange) ?? PRICE_RANGES[0]

  return sales.filter((sale) => {
    if (filters.neighborhood && sale.neighborhood !== filters.neighborhood) return false
    if (filters.propertyGroup && sale.propertyGroup !== filters.propertyGroup) return false
    // Ranges include their lower bound and exclude their upper bound.
    if (sale.price < range.min || sale.price >= range.max) return false
    if (!query) return true
    return normalizeText(sale.address).includes(query) || (sale.zip ?? '').startsWith(query)
  })
}

// Returns a new sorted array. Ties keep the newest sale first.
export function sortSales(sales, sortBy) {
  const byNewest = (a, b) => b.date.localeCompare(a.date)
  const compare = {
    newest: byNewest,
    'price-high': (a, b) => b.price - a.price || byNewest(a, b),
    'price-low': (a, b) => a.price - b.price || byNewest(a, b),
  }[sortBy] ?? byNewest
  return sales.toSorted(compare)
}

// Neighborhood names present in the data, A to Z, without duplicates.
export function getNeighborhoods(sales) {
  return [...new Set(sales.map((sale) => sale.neighborhood))].sort((a, b) => a.localeCompare(b))
}
