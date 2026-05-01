import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

// ✅ REPLACE todayDate() at the top of WeightView.jsx

function todayDate() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
export default function WeightView({ user }) {
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(todayDate())
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { fetchLogs() }, [])

  async function fetchLogs() {
    setLoading(true)
    const { data } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
    setLogs(data || [])
    setLoading(false)
  }

  async function saveWeight() {
    if (!weight) return
    setSaving(true)
    const { error } = await supabase.from('weight_logs').insert({
      user_id: user.id,
      date,
      weight: parseFloat(weight),
    })
    if (error) showToast('Error saving weight ❌')
    else {
      showToast('Weight saved! ⚖️')
      setWeight('')
      fetchLogs()
    }
    setSaving(false)
  }

  async function deleteLog(id) {
    await supabase.from('weight_logs').delete().eq('id', id)
    fetchLogs()
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const lowest = logs.length > 0 ? Math.min(...logs.map(l => l.weight)) : null
  const latest = logs.length > 0 ? logs[0].weight : null
  const first = logs.length > 0 ? logs[logs.length - 1].weight : null
  const diff = first && latest ? (latest - first).toFixed(1) : null

  return (
    <div className="tracker-view">
      <h2 className="view-title">⚖️ Weight Tracker</h2>

      {/* Input Card */}
      <div className="log-card">
        <h3>Log Today's Weight</h3>
        <div className="log-inputs">
          <div>
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label>Weight (kg)</label>
            <input
              type="number"
              placeholder="ej. 75.5"
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
          </div>
          <button className="save-btn" onClick={saveWeight} disabled={saving}>
            {saving ? 'Saving...' : 'Save ⚖️'}
          </button>
        </div>
      </div>

      {/* Stats */}
      {logs.length > 0 && (
        <div className="stats-bar">
          <div className="stat-box">
            <div className="val">{logs.length}</div>
            <div className="lbl">Days logged</div>
          </div>
          <div className="stat-box">
            <div className="val green">{lowest} kg</div>
            <div className="lbl">Lowest</div>
          </div>
          <div className="stat-box">
            <div className="val">{latest} kg</div>
            <div className="lbl">Latest</div>
          </div>
          <div className="stat-box">
            <div className={`val ${diff < 0 ? 'green' : 'orange'}`}>
              {diff > 0 ? '+' : ''}{diff} kg
            </div>
            <div className="lbl">Total change</div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading && <div className="empty-state">Loading...</div>}
      {!loading && logs.length === 0 && (
        <div className="empty-state">No weight logs yet. Start tracking! ⚖️</div>
      )}
      {!loading && logs.length > 0 && (
        <div className="log-table-wrap">
          <table className="log-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Weight (kg)</th>
                <th>Change</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => {
                const prev = logs[i + 1]
                const change = prev ? (log.weight - prev.weight).toFixed(1) : null
                return (
                  <tr key={log.id} className={log.weight === lowest ? 'best-row' : ''}>
                    <td>{logs.length - i}</td>
                    <td>{log.date}</td>
                    <td>
                      <strong>{log.weight} kg</strong>
                      {log.weight === lowest && <span className="pr-badge">🏆 Lowest!</span>}
                    </td>
                    <td>
                      {change !== null && (
                        <span className={change < 0 ? 'green' : change > 0 ? 'orange' : ''}>
                          {change > 0 ? '+' : ''}{change} kg
                        </span>
                      )}
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => deleteLog(log.id)}>🗑</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}