import React, { useState, useEffect, useCallback } from 'react'
import SetupScreen from './components/SetupScreen.jsx'
import Dashboard from './components/Dashboard.jsx'
import { fetchAllTables } from './utils/airtable.js'

const STORAGE_TOKEN = 'sgd_airtable_token'
const STORAGE_BASE = 'sgd_airtable_base'

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN) || '')
  const [baseId, setBaseId] = useState(() => localStorage.getItem(STORAGE_BASE) || 'appBFZovmfMRzOk9O')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const loadData = useCallback(async (t, b) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchAllTables(t, b)
      setData(result)
      setLastRefreshed(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) loadData(token, baseId)
  }, []) // eslint-disable-line

  const handleSave = (newToken, newBase) => {
    localStorage.setItem(STORAGE_TOKEN, newToken)
    localStorage.setItem(STORAGE_BASE, newBase)
    setToken(newToken)
    setBaseId(newBase)
    loadData(newToken, newBase)
  }

  const handleRefresh = () => loadData(token, baseId)

  if (!token) {
    return <SetupScreen onSave={handleSave} />
  }

  return (
    <Dashboard
      data={data}
      loading={loading}
      error={error}
      lastRefreshed={lastRefreshed}
      onRefresh={handleRefresh}
      token={token}
      baseId={baseId}
      onSaveCredentials={handleSave}
    />
  )
}
