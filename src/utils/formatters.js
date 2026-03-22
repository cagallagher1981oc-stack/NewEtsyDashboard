export const fmtGBP = (val) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 }).format(val ?? 0)

export const fmtNum = (val) =>
  new Intl.NumberFormat('en-GB').format(val ?? 0)

export const fmtPct = (val) =>
  `${(val ?? 0).toFixed(2)}%`

export const fmtDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const fmtMonthYear = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

export const fmtDateRange = (start, end) => {
  if (!start) return '—'
  const s = new Date(start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const e = end ? new Date(end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  return e ? `${s} – ${e}` : s
}

export const delta = (current, previous) => {
  if (previous == null || previous === 0) return null
  return ((current - previous) / Math.abs(previous)) * 100
}

export const CHART_COLORS = [
  '#C9A84C', // gold
  '#7C9A7E', // sage
  '#9B7FB6', // soft purple
  '#6B9EC7', // soft blue
  '#C47B73', // rose
  '#C4956A', // warm amber
]
