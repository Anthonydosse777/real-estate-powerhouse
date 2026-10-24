// Small calculations shared by the detail view. Each returns null when it can't be computed.

export function getMedian(numbers) {
  const values = numbers.filter((value) => value !== null).toSorted((a, b) => a - b)
  if (values.length === 0) return null
  const middle = Math.floor(values.length / 2)
  return values.length % 2 === 1 ? values[middle] : (values[middle - 1] + values[middle]) / 2
}

export function getPricePerSqft(sale) {
  if (sale.price === null || sale.grossSqft === null) return null
  return Math.round(sale.price / sale.grossSqft)
}
