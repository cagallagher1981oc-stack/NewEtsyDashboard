import React, { useState, useMemo } from 'react'

function EmptyState({ message = 'No data yet' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-soft-brown">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 4L28 16H40L30 24L34 36L24 28L14 36L18 24L8 16H20L24 4Z" fill="#F5E6B8" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      <p className="text-sm font-sans">{message}</p>
    </div>
  )
}

export default function SortableTable({ columns, rows, rowKey, saleWeekKey, noteKey }) {
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [tooltip, setTooltip] = useState(null)

  const handleSort = (colKey) => {
    if (sortCol === colKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(colKey)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    if (!sortCol) return rows
    return [...rows].sort((a, b) => {
      const av = a[sortCol]
      const bv = b[sortCol]
      const cmp = typeof av === 'number' ? av - bv : String(av ?? '').localeCompare(String(bv ?? ''))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [rows, sortCol, sortDir])

  if (!rows.length) return <EmptyState />

  return (
    <div className="overflow-x-auto rounded-2xl border border-border relative">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="bg-cream border-b border-border">
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="px-4 py-3 text-left font-medium text-soft-brown cursor-pointer hover:text-ink select-none whitespace-nowrap"
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {sortCol === col.key ? (
                    <span className="text-gold">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  ) : (
                    <span className="text-border">↕</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const isSale = saleWeekKey && row[saleWeekKey]
            const note = noteKey && row[noteKey]
            return (
              <tr
                key={row[rowKey] ?? i}
                className={`table-row-alt border-b border-border last:border-0 hover:bg-gold-light/30 transition-colors relative ${isSale ? 'bg-gold-light/40' : ''}`}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={`px-4 py-2.5 whitespace-nowrap ${col.mono ? 'font-mono text-xs' : ''} ${col.align === 'right' ? 'text-right' : ''}`}
                    onMouseEnter={note && col.key === columns[0].key ? (e) => setTooltip({ text: note, x: e.clientX, y: e.clientY }) : undefined}
                    onMouseLeave={note && col.key === columns[0].key ? () => setTooltip(null) : undefined}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      {tooltip && (
        <div
          className="fixed z-50 bg-ink text-warm-white text-xs rounded-lg px-3 py-2 max-w-xs pointer-events-none shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
