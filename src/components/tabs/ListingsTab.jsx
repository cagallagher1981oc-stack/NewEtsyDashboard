import React, { useMemo, useState } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import KPICard from '../ui/KPICard.jsx'
import SortableTable from '../ui/SortableTable.jsx'
import CustomTooltip from '../ui/CustomTooltip.jsx'
import { fmtGBP, fmtNum, fmtPct, fmtDateRange, CHART_COLORS } from '../../utils/formatters.js'

const TRAFFIC_KEYS = [
  { key: 'Etsy App & Other Pages', label: 'Etsy App & Pages', color: CHART_COLORS[0] },
  { key: 'Etsy Search', label: 'Etsy Search', color: CHART_COLORS[1] },
  { key: 'Etsy Marketing & SEO', label: 'Etsy Marketing', color: CHART_COLORS[2] },
  { key: 'Direct & Other Traffic', label: 'Direct & Other', color: CHART_COLORS[3] },
  { key: 'Social Media', label: 'Social Media', color: CHART_COLORS[4] },
  { key: 'Etsy Ads', label: 'Etsy Ads', color: CHART_COLORS[5] },
]

export default function ListingsTab({ records }) {
  const f = (r, k) => r?.fields?.[k] ?? 0
  const [selectedListing, setSelectedListing] = useState('__all__')
  const [filterText, setFilterText] = useState('')

  const uniqueListings = useMemo(() => {
    const names = [...new Set(records.map(r => r.fields?.['Listing']).filter(Boolean))]
    return names.sort()
  }, [records])

  // Aggregate by listing name
  const byListing = useMemo(() => {
    const map = {}
    records.forEach(r => {
      const name = r.fields?.['Listing'] ?? 'Unknown'
      if (!map[name]) map[name] = { name, revenue: 0, visits: 0, sold: 0, records: [] }
      map[name].revenue += f(r, 'Revenue')
      map[name].visits += f(r, 'Visits')
      map[name].sold += f(r, 'Sold')
      map[name].records.push(r)
    })
    return Object.values(map)
  }, [records])

  const topByRevenue = useMemo(() =>
    [...byListing].sort((a, b) => b.revenue - a.revenue).slice(0, 10),
    [byListing]
  )

  const topRevenueListing = topByRevenue[0]
  const topCVR = useMemo(() => {
    return [...byListing]
      .map(l => ({
        ...l,
        cvr: l.visits > 0 ? (l.sold / l.visits) * 100 : 0
      }))
      .sort((a, b) => b.cvr - a.cvr)[0]
  }, [byListing])

  const filteredRecords = useMemo(() => {
    let recs = records
    if (selectedListing !== '__all__') recs = recs.filter(r => r.fields?.['Listing'] === selectedListing)
    if (filterText.trim()) {
      const q = filterText.trim().toLowerCase()
      recs = recs.filter(r => (r.fields?.['Listing'] ?? '').toLowerCase().includes(q))
    }
    return recs.sort((a, b) => new Date(a.fields?.['Start Date'] ?? 0) - new Date(b.fields?.['Start Date'] ?? 0))
  }, [records, selectedListing, filterText])

  // Chart: selected listing visits over time
  const selectedListingChartData = useMemo(() => {
    if (selectedListing === '__all__') return []
    return filteredRecords.map(r => ({
      date: fmtDateRange(r.fields?.['Start Date'], r.fields?.['End Date']),
      visits: f(r, 'Visits'),
      sold: f(r, 'Sold'),
      revenue: f(r, 'Revenue'),
    }))
  }, [filteredRecords, selectedListing])

  // Traffic donut for selected listing
  const trafficDonutData = useMemo(() => {
    const recs = selectedListing === '__all__' ? records : filteredRecords
    return TRAFFIC_KEYS.map(t => ({
      name: t.label,
      value: recs.reduce((sum, r) => sum + f(r, t.key), 0),
      color: t.color,
    })).filter(d => d.value > 0)
  }, [filteredRecords, selectedListing, records])

  const tableRows = useMemo(() => filteredRecords.map(r => ({
    id: r.id,
    listing: r.fields?.['Listing'] ?? '—',
    dateRange: fmtDateRange(r.fields?.['Start Date'], r.fields?.['End Date']),
    visits: f(r, 'Visits'),
    sold: f(r, 'Sold'),
    revenue: f(r, 'Revenue'),
    cvr: f(r, 'Conversion Rate'),
    etsyApp: f(r, 'Etsy App & Other Pages'),
    etsySearch: f(r, 'Etsy Search'),
    social: f(r, 'Social Media'),
    notes: r.fields?.['Notes'],
  })), [filteredRecords])

  const tableCols = [
    { key: 'listing', label: 'Listing' },
    { key: 'dateRange', label: 'Period' },
    { key: 'visits', label: 'Visits', mono: true, render: v => fmtNum(v) },
    { key: 'sold', label: 'Sold', mono: true, render: v => fmtNum(v) },
    { key: 'revenue', label: 'Revenue', mono: true, render: v => fmtGBP(v) },
    { key: 'cvr', label: 'CVR', mono: true, render: v => v ? fmtPct(v) : '—' },
    { key: 'etsyApp', label: 'Etsy App', mono: true, render: v => fmtNum(v) },
    { key: 'etsySearch', label: 'Etsy Search', mono: true, render: v => fmtNum(v) },
    { key: 'social', label: 'Social', mono: true, render: v => fmtNum(v) },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="kpi-card">
          <p className="text-xs font-medium uppercase tracking-widest text-soft-brown font-sans">Total Records</p>
          <p className="text-3xl font-mono text-ink">{fmtNum(records.length)}</p>
        </div>
        <div className="kpi-card">
          <p className="text-xs font-medium uppercase tracking-widest text-soft-brown font-sans">Unique Listings</p>
          <p className="text-3xl font-mono text-ink">{fmtNum(uniqueListings.length)}</p>
        </div>
        <div className="kpi-card">
          <p className="text-xs font-medium uppercase tracking-widest text-soft-brown font-sans">Top by Revenue</p>
          <p className="text-xl font-mono text-ink truncate">{topRevenueListing?.name ?? '—'}</p>
          {topRevenueListing && <p className="text-xs text-soft-brown font-sans mt-1">{fmtGBP(topRevenueListing.revenue)}</p>}
        </div>
        <div className="kpi-card">
          <p className="text-xs font-medium uppercase tracking-widest text-soft-brown font-sans">Highest CVR</p>
          <p className="text-xl font-mono text-ink truncate">{topCVR?.name ?? '—'}</p>
          {topCVR && <p className="text-xs text-soft-brown font-sans mt-1">{fmtPct(topCVR.cvr)}</p>}
        </div>
      </div>

      {/* Listing selector */}
      <div className="card p-4 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium uppercase tracking-wider text-soft-brown font-sans mr-2">Filter:</span>
        <button
          onClick={() => setSelectedListing('__all__')}
          className={`px-3 py-1 rounded-full text-xs font-medium font-sans transition-colors ${
            selectedListing === '__all__'
              ? 'bg-gold text-white'
              : 'bg-cream text-soft-brown hover:bg-gold-light'
          }`}
        >
          All Listings
        </button>
        {uniqueListings.map(name => (
          <button
            key={name}
            onClick={() => setSelectedListing(name === selectedListing ? '__all__' : name)}
            className={`px-3 py-1 rounded-full text-xs font-medium font-sans transition-colors ${
              selectedListing === name
                ? 'bg-gold text-white'
                : 'bg-cream text-soft-brown hover:bg-gold-light'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top listings by revenue */}
        <div className="card p-5">
          <h3 className="text-sm font-serif text-ink mb-4">Top Listings by Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topByRevenue} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} tickFormatter={v => `£${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: 'DM Sans' }} width={130} />
              <Tooltip content={<CustomTooltip formatters={{ revenue: fmtGBP }} />} />
              <Bar dataKey="revenue" fill={CHART_COLORS[0]} name="Revenue" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic donut */}
        <div className="card p-5">
          <h3 className="text-sm font-serif text-ink mb-4">
            Traffic Mix{selectedListing !== '__all__' ? ` — ${selectedListing}` : ' — All Listings'}
          </h3>
          {trafficDonutData.length > 0 ? (
            <div className="flex gap-4">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={trafficDonutData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                    {trafficDonutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0]
                      return (
                        <div className="bg-ink text-warm-white rounded-lg px-3 py-2 text-xs font-sans">
                          <p className="font-medium">{d.name}</p>
                          <p className="font-mono">{fmtNum(d.value)}</p>
                        </div>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 justify-center flex-1">
                {trafficDonutData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-sans gap-2">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className="text-soft-brown truncate">{d.name}</span>
                    </span>
                    <span className="font-mono text-ink shrink-0">{fmtNum(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-soft-brown text-sm font-sans py-8 text-center">No traffic data</p>
          )}
        </div>
      </div>

      {/* Listing history chart (only when one selected) */}
      {selectedListing !== '__all__' && selectedListingChartData.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-serif text-ink mb-4">History — {selectedListing}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={selectedListingChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'DM Mono' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} width={40} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} width={65} tickFormatter={v => `£${v}`} />
              <Tooltip content={<CustomTooltip formatters={{ visits: fmtNum, sold: fmtNum, revenue: fmtGBP }} />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans' }} />
              <Line yAxisId="left" type="monotone" dataKey="visits" stroke={CHART_COLORS[1]} strokeWidth={2} name="Visits" dot={{ r: 3 }} />
              <Line yAxisId="left" type="monotone" dataKey="sold" stroke={CHART_COLORS[4]} strokeWidth={2} name="Sold" dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2} name="Revenue" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4 gap-4">
          <h3 className="text-sm font-serif text-ink">
            Listing Records {selectedListing !== '__all__' ? `— ${selectedListing}` : ''}
            <span className="text-soft-brown text-xs font-sans ml-2">({filteredRecords.length})</span>
          </h3>
          <input
            type="text"
            placeholder="Filter by listing name…"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="border border-border rounded-lg px-3 py-1.5 text-sm bg-cream focus:outline-none focus:border-gold font-sans w-56"
          />
        </div>
        <SortableTable columns={tableCols} rows={tableRows} rowKey="id" noteKey="notes" />
      </div>
    </div>
  )
}
