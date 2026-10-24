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

// Nearby sales shown in the property detail.
const NEARBY_SIZE = 8

// Half a mile in degrees: about 69 miles per degree of latitude, and about
// 52.4 miles per degree of longitude at Staten Island's latitude (40.6°N).
const HALF_MILE_LAT = 0.5 / 69
const HALF_MILE_LNG = 0.5 / 52.4

// The snapshot uses SoQL's median(), so the UI labels the value as a median.
export const TYPICAL_PRICE_LABEL = 'Median price'

export const PROPERTY_GROUPS = [
  '1–3 family homes',
  'Condos & co-ops',
  'Rental buildings',
  'Land',
  'Commercial & other',
]

const OTHER_GROUP = 'Commercial & other'

// Every building class code found in 2025 Staten Island sales. Codes not listed
// here (should new ones appear) fall into "Commercial & other".
const GROUP_BY_CODE = {
  '01': '1–3 family homes', // one family dwellings
  '02': '1–3 family homes', // two family dwellings
  '03': '1–3 family homes', // three family dwellings
  '04': 'Condos & co-ops', // tax class 1 condos
  '09': 'Condos & co-ops', // co-ops, walkup
  '10': 'Condos & co-ops', // co-ops, elevator
  '12': 'Condos & co-ops', // condos, walkup
  '13': 'Condos & co-ops', // condos, elevator
  '15': 'Condos & co-ops', // condos, 2-10 unit residential
  '07': 'Rental buildings', // rentals, walkup
  '08': 'Rental buildings', // rentals, elevator
  '14': 'Rental buildings', // rentals, 4-10 unit
  '05': 'Land', // tax class 1 vacant land
  '31': 'Land', // commercial vacant land
  '06': OTHER_GROUP, // tax class 1, other
  '21': OTHER_GROUP, // office buildings
  '22': OTHER_GROUP, // store buildings
  '26': OTHER_GROUP, // other hotels
  '27': OTHER_GROUP, // factories
  '28': OTHER_GROUP, // commercial condos
  '29': OTHER_GROUP, // commercial garages
  '30': OTHER_GROUP, // warehouses
  '32': OTHER_GROUP, // hospital and health facilities
  '33': OTHER_GROUP, // educational facilities
  '37': OTHER_GROUP, // religious facilities
  '41': OTHER_GROUP, // tax class 4, other
  '43': OTHER_GROUP, // condo office buildings
  '44': OTHER_GROUP, // condo parking
  '46': OTHER_GROUP, // condo store buildings
}

function getPropertyGroup(code) {
  return GROUP_BY_CODE[code] ?? OTHER_GROUP
}

function codesInGroups(groups) {
  return Object.keys(GROUP_BY_CODE).filter((code) => groups.includes(GROUP_BY_CODE[code]))
}

// SoQL string literal: wrap in single quotes and double any quotes inside.
function quote(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}

// SoQL condition: the row's building class code is (or is not) one of these codes.
function codeCondition(codes, operator = 'in') {
  return `substring(building_class_category, 1, 2) ${operator} (${codes.map(quote).join(',')})`
}

// "Commercial & other" is everything outside the other four groups, so codes
// missing from GROUP_BY_CODE are included too.
function groupCondition(group) {
  if (group === OTHER_GROUP) {
    return codeCondition(codesInGroups(PROPERTY_GROUPS.filter((name) => name !== OTHER_GROUP)), 'not in')
  }
  return codeCondition(codesInGroups([group]))
}

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
].join(',')

function buildUrl(params) {
  return `${SALES_ENDPOINT}?${new URLSearchParams(params)}`
}

export function buildSalesUrl() {
  return buildUrl({
    $select: SALE_FIELDS,
    $where: REAL_2025_SALES,
    $order: 'sale_date DESC, sale_price DESC',
    $limit: String(MAX_SALES),
  })
}

// One grouped request: real sales per neighborhood, plus the median price of
// residential sales only (case() returns null for other rows, which median skips).
export function buildMarketSnapshotUrl() {
  const isResidential = codeCondition(codesInGroups(['1–3 family homes', 'Condos & co-ops']))
  return buildUrl({
    $select: `neighborhood, count(*) AS sales_count, median(case(${isResidential}, sale_price)) AS typical_price`,
    $where: REAL_2025_SALES,
    $group: 'neighborhood',
    $order: 'sales_count DESC',
    $limit: String(SNAPSHOT_SIZE),
  })
}

// 2025 sales of the same property group within about half a mile (a lat/lng box),
// or in the same neighborhood when the sale has no coordinates. This sale is excluded.
export function buildNearbySalesUrl(sale) {
  const conditions = [
    REAL_2025_SALES,
    groupCondition(sale.propertyGroup),
    `NOT (block = ${quote(sale.block)} AND lot = ${quote(sale.lot)} AND sale_date = ${quote(`${sale.date}T00:00:00`)})`,
  ]
  if (sale.lat !== null && sale.lng !== null) {
    conditions.push(
      `latitude between ${(sale.lat - HALF_MILE_LAT).toFixed(6)} and ${(sale.lat + HALF_MILE_LAT).toFixed(6)}`,
      `longitude between ${(sale.lng - HALF_MILE_LNG).toFixed(6)} and ${(sale.lng + HALF_MILE_LNG).toFixed(6)}`,
    )
  } else {
    conditions.push(`neighborhood = ${quote(sale.neighborhoodKey)}`)
  }
  return buildUrl({
    $select: SALE_FIELDS,
    $where: conditions.join(' AND '),
    $order: 'sale_date DESC, sale_price DESC',
    $limit: String(NEARBY_SIZE),
  })
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
  const classCode = row.building_class_category?.slice(0, 2) ?? null
  const { address, unit } = splitAddress(row.address, row.apartment_number)

  return {
    // Several units in one building can sell on the same day at the same price, and
    // a few rows share a bbl with a different lot, so lot, address, and unit are in the id too.
    id: [bbl, row.lot, date, row.sale_price, row.address, row.apartment_number ?? ''].join('|'),
    address,
    unit,
    neighborhood: formatNeighborhood(row.neighborhood),
    // The API's own spelling, used to query by neighborhood.
    neighborhoodKey: row.neighborhood ?? null,
    classCode,
    propertyType: formatPropertyType(row.building_class_category),
    propertyGroup: getPropertyGroup(classCode),
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
