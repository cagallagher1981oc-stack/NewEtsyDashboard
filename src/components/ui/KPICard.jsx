import React from 'react'
import { delta } from '../../utils/formatters.js'

export default function KPICard({ label, value, prev, format = (v) => v, subtitle }) {
  const pct = prev != null ? delta(
    typeof value === 'number' ? value : 0,
    typeof prev === 'number' ? prev : 0
  ) : null
  const up = pct != null && pct >= 0

  return (
    <div className="kpi-card flex flex-col gap-1 min-w-0">
      <p className="text-xs font-medium uppercase tracking-widest text-soft-brown font-sans">{label}</p>
      <p className="text-3xl font-mono tabular-nums text-ink leading-tight">{format(value)}</p>
      {subtitle && <p className="text-xs text-soft-brown font-sans">{subtitle}</p>}
      {pct != null && (
        <p className={`text-xs font-medium font-sans mt-1 ${up ? 'trend-up' : 'trend-down'}`}>
          {up ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}% vs prior
        </p>
      )}
    </div>
  )
}
