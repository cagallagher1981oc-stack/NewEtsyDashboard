import React, { useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import KPICard from '../ui/KPICard.jsx'
import SortableTable from '../ui/SortableTable.jsx'
import CustomTooltip from '../ui/CustomTooltip.jsx'
import { fmtGBP, fmtNum, fmtPct, fmtDate, fmtDateRange, CHART_COLORS } from '../../utils/formatters.js'

const TRAFFIC_KEYS = [
  { key: 'Etsy App & Other Pages', label: 'Etsy App & Pages', color: CHART_COLORS[0] },
  { key: 'Etsy Search', label: 'Etsy Search', color: CHART_COLORS[1] },
  { key: 'Etsy Marketing & SEO', label: 'Etsy Marketing', color: CHART_COLORS[2] },
  { key: 'Direct & Other Traffic', label: 'Direct & Other', color: CHART_COLORS[3] },
  { key: 'Social Media', label: 'Social Media', color: CHART_COLORS[4] },
  { key: 'Etsy Ads', label: 'Etsy Ads', color: CHART_COLORS[5] },
]

function sortByWeek(records) {
  return [...records].sort((a, b) => {
    const wa = a.fields?.['Week No'] ?? 0
    const wb = b.fields?.['Week No'] ?? 0
    return wa - wb
  })
}

export default function WeeklyTab({ records }) {
  const sorted = useMemo(() => sortByWeek(records), [records])

  const latest = sorted[sorted.length - 1]
  const prev = sorted[sorted.length - 2]

  const f = (r, k) => r?.fields?.[k] ?? 0

  const last12 = sorted.slice(-12)

  const chartData = useMemo(() => last12.map(r => ({
    week: `W${f(r, 'Week No')}`,
    visits: f(r, 'Visits'),
    orders: f(r, 'Orders'),
    revenue: f(r, 'Revenue'),
    isSale: r.fields?.['Sale Week'] ? true : false,
  })), [last12])

  const trafficData = useMemo(() => {
    if (!latest) return []
    return TRAFFIC_KEYS.map(t => ({
      name: t.label,
      value: f(latest, t.key),
      color: t.color,
    })).filter(d => d.value > 0)
  }, [latest])

  const tableRows = useMemo(() => sorted.map((r, i) => {
    const prev = sorted[i - 1]
    const visitsDelta = prev ? f(r, 'Visits') - f(prev, 'Visits') : null
    return {
      id: r.id,
      weekNo: f(r, 'Week No'),
      dateRange: fmtDateRange(r.fields?.['Start Date'], r.fields?.['End Date']),
      visits: f(r, 'Visits'),
      visitsDelta,
      orders: f(r, 'Orders'),
      revenue: f(r, 'Revenue'),
      cvr: f(r, 'Conversion Rate'),
      favourites: f(r, 'Favourites'),
      saleWeek: r.fields?.['Sale Week'],
      notes: r.fields?.['Notes'],
    }
  }), [sorted])

  const tableCols = [
    { key: 'weekNo', label: 'Week', mono: true },
    { key: 'dateRange', label: 'Date Range' },
    { key: 'visits', label: 'Visits', mono: true, render: v => fmtNum(v) },
    {
      key: 'visitsDelta',
      label: 'Δ Visits',
      mono: true,
      render: v => v == null ? '—' : (
        <span className={v >= 0 ? 'trend-up' : 'trend-down'}>
          {v >= 0 ? '+' : ''}{fmtNum(v)}
        </span>
      )
    },
    { key: 'orders', label: 'Orders', mono: true, render: v => fmtNum(v) },
    { key: 'revenue', label: 'Revenue', mono: true, render: v => fmtGBP(v) },
    { key: 'cvr', label: 'CVR', mono: true, render: v => fmtPct(v) },
    { key: 'favourites', label: 'Favourites', mono: true, render: v => fmtNum(v) },
    {
      key: 'saleWeek',
      label: 'Sale?',
      render: v => v ? (
        <span className="bg-gold-light text-gold text-xs font-medium px-2 py-0.5 rounded-full">Sale</span>
      ) : null
    },
  ]

  if (!latest) return <div className="text-soft-brown p-8 font-sans">No weekly data available.</div>

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KPICard label="Visits" value={f(latest, 'Visits')} prev={f(prev, 'Visits')} format={fmtNum}
          subtitle={`Week ${f(latest, 'Week No')}`} />
        <KPICard label="Orders" value={f(latest, 'Orders')} prev={f(prev, 'Orders')} format={fmtNum} />
        <KPICard label="Revenue" value={f(latest, 'Revenue')} prev={f(prev, 'Revenue')} format={fmtGBP} />
        <KPICard label="Conversion Rate" value={f(latest, 'Conversion Rate')} prev={f(prev, 'Conversion Rate')} format={fmtPct} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visits line chart */}
        <div className="card p-5">
          <h3 className="text-sm font-serif text-ink mb-4">Visits — Last 12 Weeks</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'DM Mono' }} width={50} />
              <Tooltip content={<CustomTooltip formatters={{ visits: fmtNum }} />} />
              <Line
                type="monotone"
                dataKey="visits"
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  return payload.isSale
                    ? <circle key={props.key} cx={cx} cy={cy} r={5} fill={CHART_COLORS[4]} stroke="white" strokeWidth={2} />
                    : <circle key={props.key} cx={cx} cy={cy} r={3} fill={CHART_COLORS[0]} />
                }}
                name="Visits"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-soft-brown mt-2 font-sans">
            <span className="inline-block w-2 h-2 rounded-full bg-rose mr-1" />
            Rose dots = sale weeks
          </p>
        </div>

        {/* Orders + Revenue bar chart */}
        <div className="card p-5">
          <h3 className="text-sm font-serif text-ink mb-4">Orders &amp; Revenue — Last 12 Weeks</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} width={40} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} width={60} tickFormatter={v => `£${v}`} />
              <Tooltip content={<CustomTooltip formatters={{ orders: fmtNum, revenue: fmtGBP }} />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans' }} />
              <Bar yAxisId="left" dataKey="orders" fill={CHART_COLORS[1]} name="Orders" radius={[3, 3, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" fill={CHART_COLORS[0]} name="Revenue" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic donut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-serif text-ink mb-4">Traffic Sources — Week {f(latest, 'Week No')}</h3>
          {trafficData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                >
                  {trafficData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
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
          ) : (
            <p className="text-soft-brown text-sm font-sans py-8 text-center">No traffic data</p>
          )}
          <div className="flex flex-col gap-1 mt-2">
            {trafficData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-sans">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-soft-brown">{d.name}</span>
                </span>
                <span className="font-mono text-ink">{fmtNum(d.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional stats */}
        <div className="card p-5 md:col-span-2">
          <h3 className="text-sm font-serif text-ink mb-4">Latest Week Details — Week {f(latest, 'Week No')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Favourites', val: fmtNum(f(latest, 'Favourites')) },
              { label: 'Shop Follows', val: fmtNum(f(latest, 'Shop Follows')) },
              { label: 'Reviews', val: fmtNum(f(latest, 'Reviews')) },
              { label: 'Repeat Buyers', val: fmtNum(f(latest, 'Repeat Buyers')) },
              { label: 'Cities Reached', val: fmtNum(f(latest, 'Cities Reached')) },
              { label: 'Active Listings', val: fmtNum(f(latest, 'Listings')) },
            ].map(({ label, val }) => (
              <div key={label} className="bg-cream rounded-xl p-3">
                <p className="text-xs text-soft-brown uppercase tracking-wider font-sans mb-1">{label}</p>
                <p className="text-xl font-mono text-ink">{val}</p>
              </div>
            ))}
          </div>
          {latest.fields?.['Notes'] && (
            <div className="mt-4 bg-gold-light/40 rounded-xl p-3 border-l-2 border-gold">
              <p className="text-xs font-medium text-soft-brown uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-ink font-sans">{latest.fields['Notes']}</p>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card p-5">
        <h3 className="text-sm font-serif text-ink mb-4">All Weekly Data</h3>
        <SortableTable
          columns={tableCols}
          rows={tableRows}
          rowKey="id"
          saleWeekKey="saleWeek"
          noteKey="notes"
        />
      </div>
    </div>
  )
}
