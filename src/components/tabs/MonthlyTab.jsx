import React, { useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts'
import KPICard from '../ui/KPICard.jsx'
import SortableTable from '../ui/SortableTable.jsx'
import CustomTooltip from '../ui/CustomTooltip.jsx'
import { fmtGBP, fmtNum, fmtPct, fmtMonthYear, fmtDateRange, CHART_COLORS } from '../../utils/formatters.js'

const TRAFFIC_KEYS = [
  { key: 'Traffic — Etsy App', label: 'Etsy App', color: CHART_COLORS[0] },
  { key: 'Traffic — Etsy Search', label: 'Etsy Search', color: CHART_COLORS[1] },
  { key: 'Traffic — Etsy Marketing', label: 'Etsy Marketing', color: CHART_COLORS[2] },
  { key: 'Traffic — Direct', label: 'Direct', color: CHART_COLORS[3] },
  { key: 'Traffic — Social', label: 'Social', color: CHART_COLORS[4] },
  { key: 'Traffic — Etsy Ads', label: 'Etsy Ads', color: CHART_COLORS[5] },
]

function sortByMonth(records) {
  return [...records].sort((a, b) => {
    const da = new Date(a.fields?.['Month'] ?? 0)
    const db = new Date(b.fields?.['Month'] ?? 0)
    return da - db
  })
}

export default function MonthlyTab({ records }) {
  const sorted = useMemo(() => sortByMonth(records), [records])

  const latest = sorted[sorted.length - 1]
  const prev = sorted[sorted.length - 2]

  const f = (r, k) => r?.fields?.[k] ?? 0

  const chartData = useMemo(() => sorted.map(r => ({
    month: fmtMonthYear(r.fields?.['Month']),
    revenue: f(r, 'Revenue'),
    orders: f(r, 'Orders'),
    visits: f(r, 'Visits'),
    ...Object.fromEntries(TRAFFIC_KEYS.map(t => [t.key, f(r, t.key)])),
  })), [sorted])

  const tableRows = useMemo(() => sorted.map(r => ({
    id: r.id,
    month: fmtMonthYear(r.fields?.['Month']),
    visits: f(r, 'Visits'),
    orders: f(r, 'Orders'),
    revenue: f(r, 'Revenue'),
    cvr: f(r, 'Conversion Rate (%)'),
    favourites: f(r, 'Item Favourites'),
    follows: f(r, 'Shop Follows'),
    reviews: f(r, 'Reviews'),
    repeatCustomers: f(r, 'Repeat Customers'),
    citiesSoldTo: f(r, 'Cities Sold To'),
  })), [sorted])

  const tableCols = [
    { key: 'month', label: 'Month' },
    { key: 'visits', label: 'Visits', mono: true, render: v => fmtNum(v) },
    { key: 'orders', label: 'Orders', mono: true, render: v => fmtNum(v) },
    { key: 'revenue', label: 'Revenue', mono: true, render: v => fmtGBP(v) },
    { key: 'cvr', label: 'CVR', mono: true, render: v => fmtPct(v) },
    { key: 'favourites', label: 'Favourites', mono: true, render: v => fmtNum(v) },
    { key: 'follows', label: 'Follows', mono: true, render: v => fmtNum(v) },
    { key: 'reviews', label: 'Reviews', mono: true, render: v => fmtNum(v) },
    { key: 'repeatCustomers', label: 'Repeat', mono: true, render: v => fmtNum(v) },
    { key: 'citiesSoldTo', label: 'Cities', mono: true, render: v => fmtNum(v) },
  ]

  if (!latest) return <div className="text-soft-brown p-8 font-sans">No monthly data available.</div>

  return (
    <div className="flex flex-col gap-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KPICard label="Revenue" value={f(latest, 'Revenue')} prev={f(prev, 'Revenue')} format={fmtGBP}
          subtitle={fmtMonthYear(latest.fields?.['Month'])} />
        <KPICard label="Orders" value={f(latest, 'Orders')} prev={f(prev, 'Orders')} format={fmtNum} />
        <KPICard label="Conversion Rate" value={f(latest, 'Conversion Rate (%)')} prev={f(prev, 'Conversion Rate (%)')} format={fmtPct} />
        <KPICard label="Item Favourites" value={f(latest, 'Item Favourites')} prev={f(prev, 'Item Favourites')} format={fmtNum} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-serif text-ink mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'DM Mono' }} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'DM Mono' }} width={65} tickFormatter={v => `£${v}`} />
              <Tooltip content={<CustomTooltip formatters={{ revenue: fmtGBP }} />} />
              <Line type="monotone" dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={{ r: 3, fill: CHART_COLORS[0] }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-serif text-ink mb-4">Orders per Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'DM Mono' }} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'DM Mono' }} width={40} />
              <Tooltip content={<CustomTooltip formatters={{ orders: fmtNum }} />} />
              <Bar dataKey="orders" fill={CHART_COLORS[1]} name="Orders" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stacked traffic chart */}
      <div className="card p-5">
        <h3 className="text-sm font-serif text-ink mb-4">Traffic Sources by Month</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'DM Mono' }} />
            <YAxis tick={{ fontSize: 11, fontFamily: 'DM Mono' }} width={50} />
            <Tooltip content={<CustomTooltip formatters={Object.fromEntries(TRAFFIC_KEYS.map(t => [t.key, fmtNum]))} />} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans' }} />
            {TRAFFIC_KEYS.map(t => (
              <Bar key={t.key} dataKey={t.key} name={t.label} stackId="traffic" fill={t.color} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="card p-5">
        <h3 className="text-sm font-serif text-ink mb-4">All Monthly Data</h3>
        <SortableTable columns={tableCols} rows={tableRows} rowKey="id" />
      </div>
    </div>
  )
}
