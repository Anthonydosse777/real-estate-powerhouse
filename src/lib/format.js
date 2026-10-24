import { getPricePerSqft } from './stats.js'

// Display helpers. Every function accepts null and returns a safe value.

// Names the API cuts off at 20 characters (or abbreviates), keyed by raw value.
const NEIGHBORHOOD_CORRECTIONS = {
  'ROSSVILLE-PORT MOBIL': 'Rossville-Port Mobile',
  'RICHMONDTOWN-LIGHTHS HILL': 'Richmondtown-Lighthouse Hill',
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const shortCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat('en-US')

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

// "245 FOREST AVENUE" -> "245 Forest Avenue". Each run of letters is capitalized
// on its own, so "126Q" and "1J" keep their capital letters. Then ordinals go back to
// lowercase ("4th"), and "Mc" and "O'" names get their second capital ("McArthur", "O'Connor").
export function toTitleCase(text) {
  if (!text) return ''
  return text
    .replace(/([A-Za-z])([A-Za-z']*)/g, (_, first, rest) => first.toUpperCase() + rest.toLowerCase())
    .replace(/(\d)(St|Nd|Rd|Th)\b/g, (_, digit, suffix) => digit + suffix.toLowerCase())
    .replace(/\b(Mc|O')([a-z])/g, (_, prefix, letter) => prefix + letter.toUpperCase())
}

export function formatNeighborhood(raw) {
  if (!raw) return ''
  return NEIGHBORHOOD_CORRECTIONS[raw] ?? toTitleCase(raw)
}

// "02 TWO FAMILY DWELLINGS" -> "Two Family Dwellings"
export function formatPropertyType(raw) {
  if (!raw) return ''
  return toTitleCase(raw.replace(/^\d+\s+/, ''))
}

// 1130000 -> "$1,130,000"
export function formatCurrency(value) {
  return value === null ? '' : currencyFormatter.format(value)
}

// 1130000 -> "$1.13M"
export function formatShortCurrency(value) {
  return value === null ? '' : shortCurrencyFormatter.format(value)
}

// 4218 -> "4,218"
export function formatNumber(value) {
  return value === null ? '' : numberFormatter.format(value)
}

// "2025-12-31" -> "Dec 31, 2025". The time is added so the date is read as local, not UTC.
export function formatDate(isoDate) {
  return isoDate ? dateFormatter.format(new Date(`${isoDate}T00:00:00`)) : ''
}

// Small facts shown on a sale card, skipping anything missing.
export function getSaleFacts(sale) {
  const facts = []
  if (sale.units !== null) {
    facts.push({ label: sale.units === 1 ? 'Unit' : 'Units', value: formatNumber(sale.units) })
  }
  if (sale.grossSqft !== null) {
    facts.push({ label: 'Gross sq ft', value: formatNumber(sale.grossSqft) })
  }
  if (sale.yearBuilt !== null) {
    facts.push({ label: 'Built', value: String(sale.yearBuilt) })
  }
  return facts
}

// 412 -> "$412/sq ft"
export function formatPricePerSqft(value) {
  return value === null ? '' : `${formatCurrency(value)}/sq ft`
}

// Every detail-view fact that has a value, in display order.
export function getDetailFacts(sale) {
  const facts = [
    { label: 'Neighborhood', value: sale.neighborhood },
    { label: 'ZIP code', value: sale.zip },
    { label: 'Property type', value: sale.propertyType },
    { label: 'Property group', value: sale.propertyGroup },
    { label: 'Sale date', value: formatDate(sale.date) },
    { label: 'Residential units', value: formatNumber(sale.units) },
    { label: 'Land sq ft', value: formatNumber(sale.landSqft) },
    { label: 'Gross sq ft', value: formatNumber(sale.grossSqft) },
    { label: 'Price per gross sq ft', value: formatPricePerSqft(getPricePerSqft(sale)) },
    { label: 'Year built', value: sale.yearBuilt === null ? '' : String(sale.yearBuilt) },
    { label: 'Block and lot', value: sale.block && sale.lot ? `Block ${sale.block}, Lot ${sale.lot}` : '' },
  ]
  return facts.filter((fact) => fact.value)
}

export function getMapsUrl(sale) {
  if (sale.lat === null || sale.lng === null) return null
  return `https://www.google.com/maps/search/?api=1&query=${sale.lat},${sale.lng}`
}
