export const TABLES = {
  weekly: 'tbl9qJ2oUTYg66Yua',
  monthly: 'tbl0iKa976jtOh6l9',
  listings: 'tblTXZzRpZdPUDzGu',
}

export const fetchTable = async (tableId, apiKey, baseId) => {
  let allRecords = []
  let offset = null
  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`)
    if (offset) url.searchParams.set('offset', offset)
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) throw new Error(`Airtable error: ${res.status}`)
    const data = await res.json()
    allRecords = [...allRecords, ...data.records]
    offset = data.offset
  } while (offset)
  return allRecords
}

export const fetchAllTables = async (apiKey, baseId) => {
  const [weekly, monthly, listings] = await Promise.all([
    fetchTable(TABLES.weekly, apiKey, baseId),
    fetchTable(TABLES.monthly, apiKey, baseId),
    fetchTable(TABLES.listings, apiKey, baseId),
  ])
  return { weekly, monthly, listings }
}
