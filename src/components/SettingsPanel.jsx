import React, { useState } from 'react'

export default function SettingsPanel({ token, baseId, onSave, onClose }) {
  const [newToken, setNewToken] = useState(token)
  const [newBase, setNewBase] = useState(baseId)
  const [showToken, setShowToken] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(newToken.trim(), newBase.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/20" onClick={onClose} />
      <div className="relative w-96 bg-warm-white shadow-2xl slide-in flex flex-col h-full">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-serif text-ink">Settings</h2>
          <button onClick={onClose} className="text-soft-brown hover:text-ink text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 flex-1">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-soft-brown mb-1.5">
              Personal Access Token
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={newToken}
                onChange={e => setNewToken(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-cream focus:outline-none focus:border-gold font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowToken(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-soft-brown hover:text-ink text-xs"
              >
                {showToken ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-soft-brown mb-1.5">
              Base ID
            </label>
            <input
              type="text"
              value={newBase}
              onChange={e => setNewBase(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-cream focus:outline-none focus:border-gold font-mono"
            />
          </div>
          <button type="submit" className="btn-primary mt-auto">
            Save & Refresh
          </button>
        </form>
        <div className="px-6 pb-6">
          <p className="text-xs text-soft-brown font-sans leading-relaxed">
            🔒 Stored only on this device. Never sent anywhere except Airtable's API.
          </p>
        </div>
      </div>
    </div>
  )
}
