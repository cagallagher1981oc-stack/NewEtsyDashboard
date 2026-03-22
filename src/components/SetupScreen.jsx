import React, { useState } from 'react'

const DEFAULT_BASE = 'appBFZovmfMRzOk9O'

export default function SetupScreen({ onSave }) {
  const [token, setToken] = useState('')
  const [baseId, setBaseId] = useState(DEFAULT_BASE)
  const [showToken, setShowToken] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!token.trim()) return
    onSave(token.trim(), baseId.trim() || DEFAULT_BASE)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-ink mb-2">Sarah Gallagher Design</h1>
          <p className="text-soft-brown font-sans text-sm tracking-widest uppercase">✦ Analytics Dashboard ✦</p>
        </div>

        <div className="card p-8 shadow-md">
          <h2 className="text-xl font-serif text-ink mb-1">Connect to Airtable</h2>
          <p className="text-sm text-soft-brown font-sans mb-6">Enter your credentials to load your shop data.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-soft-brown mb-1.5">
                Personal Access Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder="pat…"
                  required
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-warm-white focus:outline-none focus:border-gold font-mono pr-10"
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
                value={baseId}
                onChange={e => setBaseId(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-warm-white focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={!token.trim()}
              className="btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load Dashboard
            </button>
          </form>

          <p className="text-xs text-soft-brown font-sans mt-5 leading-relaxed border-t border-border pt-4">
            🔒 Your credentials are stored only on this device and never sent anywhere except Airtable's API.
          </p>
        </div>
      </div>
    </div>
  )
}
