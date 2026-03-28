import React from 'react'

export function SkeletonCard() {
  return (
    <div className="kpi-card flex flex-col gap-2">
      <div className="shimmer h-3 w-24 rounded" />
      <div className="shimmer h-8 w-32 rounded" />
      <div className="shimmer h-3 w-16 rounded" />
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="shimmer h-4 w-40 rounded" />
      <div className="shimmer rounded" style={{ height: 220 }} />
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="card p-5 flex flex-col gap-2">
      <div className="shimmer h-4 w-48 rounded mb-2" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="shimmer h-8 rounded" />
      ))}
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className="p-4 sm:p-8 flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonChart /><SkeletonChart />
      </div>
      <SkeletonTable />
    </div>
  )
}
