import React from 'react'

export default function CustomTooltip({ active, payload, label, formatters = {} }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-ink text-warm-white rounded-xl px-4 py-3 shadow-xl text-xs font-sans min-w-[140px]">
      {label && <p className="font-medium text-gold-light mb-2 font-serif">{label}</p>}
      {payload.map((entry, i) => {
        const fmt = formatters[entry.dataKey] || ((v) => v)
        return (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.color }} />
              {entry.name}
            </span>
            <span className="font-mono tabular-nums">{fmt(entry.value)}</span>
          </div>
        )
      })}
    </div>
  )
}
