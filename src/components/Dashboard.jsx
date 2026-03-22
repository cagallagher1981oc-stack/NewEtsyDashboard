import React, { useState } from 'react'
import { LoadingScreen } from './ui/Skeleton.jsx'
import SettingsPanel from './SettingsPanel.jsx'
import WeeklyTab from './tabs/WeeklyTab.jsx'
import MonthlyTab from './tabs/MonthlyTab.jsx'
import ListingsTab from './tabs/ListingsTab.jsx'

const TABS = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'listings', label: 'Listings' },
]

export default function Dashboard({ data, loading, error, lastRefreshed, onRefresh, token, baseId, onSaveCredentials }) {
  const [activeTab, setActiveTab] = useState('weekly')
  const [showSettings, setShowSettings] = useState(false)

  const handleSave = (newToken, newBase) => {
    setShowSettings(false)
    onSaveCredentials(newToken, newBase)
  }

  const fmtRefreshed = lastRefreshed
    ? lastRefreshed.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="min-h-screen bg-cream">
      {/* Top Bar */}
      <header className="bg-warm-white border-b border-border sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-6">
          <h1 className="text-base font-serif text-ink whitespace-nowrap">
            Sarah Gallagher Design <span className="text-gold">✦</span> Analytics
          </h1>

          <nav className="flex items-center gap-1 ml-4">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {fmtRefreshed && (
              <span className="text-xs text-soft-brown font-sans hidden lg:block">
                Updated {fmtRefreshed}
              </span>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="btn-ghost text-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="btn-ghost"
              title="Settings"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {error && (
          <div className="card border-rose/40 bg-rose/5 p-5 mb-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-rose font-sans">Failed to load data</p>
              <p className="text-sm text-soft-brown font-sans mt-1">{error}</p>
            </div>
            <button onClick={onRefresh} className="btn-primary bg-rose hover:bg-red-600 text-sm">
              Try again
            </button>
          </div>
        )}

        {loading && !data && <LoadingScreen />}

        {!loading && data && (
          <div className="fade-in">
            {activeTab === 'weekly' && <WeeklyTab records={data.weekly} />}
            {activeTab === 'monthly' && <MonthlyTab records={data.monthly} />}
            {activeTab === 'listings' && <ListingsTab records={data.listings} />}
          </div>
        )}

        {loading && data && (
          <div className="fixed bottom-6 right-6 bg-ink text-warm-white text-xs rounded-lg px-4 py-2 font-sans shadow-xl">
            Refreshing…
          </div>
        )}
      </main>

      {showSettings && (
        <SettingsPanel
          token={token}
          baseId={baseId}
          onSave={handleSave}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
