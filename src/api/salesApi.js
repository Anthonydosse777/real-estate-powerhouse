import { formatNeighborhood, formatPropertyType, toTitleCase } from '../lib/format.js'

const SALES_ENDPOINT = 'https://data.cityofnewyork.us/resource/w2pb-icbu.json'

// Staten Island (borough is a text field), 2025 sale dates, real sales only.
const REAL_2025_SALES = [
  "borough = '5'",
  "sale_date between '2025-01-01T00:00:00' and '2025-12-31T23:59:59'",
  'sale_price >= 10000',
].join(' AND ')

// About 4,500 rows match, so this returns every one in a single request.
const MAX_SALES = 10000

// Neighborhoods shown in the market snapshot.
const SNAPSHOT_SIZE = 6

// Building class codes for one-, two-, and three-family homes, condos, and co-ops.
const RESIDENTIAL_CODES = ['01', '02', '03', '04', '09', '10', '12', '13', '15']

// The snapshot uses SoQL's median(), so the UI labels the value as a median.
export const TYPICAL_PRICE_LABEL = 'Median price'

const SALE_FIELDS = [
  'neighborhood',
  'building_class_category',
  'address',
  'apartment_number',
  'zip_code',
  'residential_units',
  'total_units',
  'land_square_feet',
  'gross_square_feet',
  'year_built',
  'sale_price',
  'sale_date',
  'latitude',
  'longitude',
  'block',
  'lot',
  'bbl',
]

export function buildSalesUrl() {
  const params = new URLSearchParams({
    $select: SALE_FIELDS.join(','),
    $where: REAL_2025_SALES,
    $order: 'sale_date DESC, sale_price DESC',
    $limit: String(MAX_SALES),
  })
  return `${SALES_ENDPOINT}?${params}`
}

// One grouped request: real sales per neighborhood, plus the median price of
// residential sales only (case() returns null for other rows, which median skips).
export function buildMarketSnapshotUrl() {
  const codes = RESIDENTIAL_CODES.map((code) => `'${code}'`).join(',')
  const isResidential = `substring(building_class_category, 1, 2) in (${codes})`
  const params = new URLSearchParams({
    $select: `neighborhood, count(*) AS sales_count, median(case(${isResidential}, sale_price)) AS typical_price`,
    $where: REAL_2025_SALES,
    $group: 'neighborhood',
    $order: 'sales_count DESC',
    $limit: String(SNAPSHOT_SIZE),
  })
  return `${SALES_ENDPOINT}?${params}`
}

// "3,410" -> 3410. Missing or unreadable values become null.
function toNumber(value) {
  if (value === undefined || value === null || value === '') return null
  const number = Number(String(value).replaceAll(',', ''))
  return Number.isFinite(number) ? number : null
}

// For counts and sizes, 0 means "not recorded", so treat it as missing.
function toPositiveNumber(value) {
  const number = toNumber(value)
  return number !== null && number > 0 ? number : null
}

// Newer rows have no bbl, but it is always borough + 5-digit block + 4-digit lot.
function getBbl(row) {
  if (row.bbl) return row.bbl
  return `5${row.block.padStart(5, '0')}${row.lot.padStart(4, '0')}`
}

// Co-op units are written into the address ("245 FOREST AVENUE, 2E"), and vacant
// lots start with "N/A ", so split those apart for display.
function splitAddress(rawAddress, rawUnit) {
  const [street, unitInAddress] = (rawAddress ?? '').replace(/^N\/A\s+/, '').split(/,\s*/)
  const unit = rawUnit?.trim() || unitInAddress?.trim() || null
  return { address: toTitleCase(street.trim()), unit: unit ? unit.toUpperCase() : null }
}

export function normalizeSale(row) {
  const bbl = getBbl(row)
  const date = row.sale_date.slice(0, 10)
  const { address, unit } = splitAddress(row.address, row.apartment_number)

  return {
    // Several units in one building can sell on the same day at the same price, and
    // a few rows share a bbl with a different lot, so lot, address, and unit are in the id too.
    id: [bbl, row.lot, date, row.sale_price, row.address, row.apartment_number ?? ''].join('|'),
    address,
    unit,
    neighborhood: formatNeighborhood(row.neighborhood),
    propertyType: formatPropertyType(row.building_class_category),
    zip: row.zip_code ?? null,
    price: toNumber(row.sale_price),
    date,
    units: toPositiveNumber(row.residential_units),
    landSqft: toPositiveNumber(row.land_square_feet),
    grossSqft: toPositiveNumber(row.gross_square_feet),
    yearBuilt: toPositiveNumber(row.year_built),
    lat: toNumber(row.latitude),
    lng: toNumber(row.longitude),
    block: row.block ?? null,
    lot: row.lot ?? null,
    bbl,
  }
}

export function normalizeNeighborhoodStat(row) {
  return {
    neighborhood: formatNeighborhood(row.neighborhood),
    salesCount: toNumber(row.sales_count) ?? 0,
    typicalPrice: toNumber(row.typical_price),
  }
}
