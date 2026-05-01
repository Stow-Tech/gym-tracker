import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

// ✅ REPLACE todayDate() at the top of SpeedView.jsx

function todayDate() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function SpeedView({ user }) {
  const [speed, setSpeed] = useState('')
  const [date, setDate] = useState(todayDate())
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { fetchLogs() }, [])

  async function fetchLogs() {
    setLoading(true)
    const { data } = await supabase
      .from('speed_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
    setLogs(data || [])
    setLoading(false)
  }

  async function saveSpeed() {
    if (!speed) return
    setSaving(true)
    const { error } = await supabase.from('speed_logs').insert({
      user_id: user.id,
      date,
      speed: parseFloat(speed),
    })
    if (error) showToast('Error saving speed ❌')
    else {
      showToast('Speed saved! ⚡')
      setSpeed('')
      fetchLogs()
    }
    setSaving(false)
  }

  async function deleteLog(id) {
    await supabase.from('speed_logs').delete().eq('id', id)
    fetchLogs()
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const best = logs.length > 0 ? Math.max(...logs.map(l => l.speed)) : null
  const avg = logs.length > 0
    ? (logs.reduce((a, l) => a + l.speed, 0) / logs.length).toFixed(1)
    : null

  return (
    <div className="tracker-view">
      <h2 className="view-title">⚡ Speed Tracker</h2>

      {/* Input Card */}
      <div className="log-card">
        <h3>Log Today's Speed</h3>
        <div className="log-inputs">
          <div>
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label>Speed (km/h)</label>
            <input
              type="number"
              placeholder="ej. 12.5"
              value={speed}
              onChange={e => setSpeed(e.target.value)}
            />
          </div>
          <button className="save-btn" onClick={saveSpeed} disabled={saving}>
            {saving ? 'Saving...' : 'Save ⚡'}
          </button>
        </div>
      </div>

      {/* Stats */}
      {logs.length > 0 && (
        <div className="stats-bar">
          <div className="stat-box">
            <div className="val">{logs.length}</div>
            <div className="lbl">Sessions</div>
          </div>
          <div className="stat-box">
            <div className="val green">{best}</div>
            <div className="lbl">Best (km/h)</div>
          </div>
          <div className="stat-box">
            <div className="val">{avg}</div>
            <div className="lbl">Avg (km/h)</div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading && <div className="empty-state">Loading...</div>}
      {!loading && logs.length === 0 && (
        <div className="empty-state">No speed logs yet. Start tracking! ⚡</div>
      )}
      {!loading && logs.length > 0 && (
        <div className="log-table-wrap">
          <table className="log-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Speed (km/h)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.id} className={log.speed === best ? 'best-row' : ''}>
                  <td>{logs.length - i}</td>
                  <td>{log.date}</td>
                  <td>
                    <strong>{log.speed}</strong>
                    {log.speed === best && <span className="pr-badge">🏆 Best!</span>}
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteLog(log.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
