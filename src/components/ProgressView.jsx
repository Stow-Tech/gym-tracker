import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { workoutPlan } from '../workoutData'

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December']

export default function ProgressView({ user }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchSessions() }, [month])

  async function fetchSessions() {
  setLoading(true)
  const y = 2026
  const from = `${y}-${String(month + 1).padStart(2, '0')}-01`
  const lastDay = new Date(y, month + 1, 0).getDate()
const to = `${y}-${String(month + 1).padStart(2, '0')}-${lastDay}`
  
  const { data: sessionsData, error: sErr } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: false })

  if (sErr) { setLoading(false); return }

  const sessionsWithLogs = await Promise.all(
    (sessionsData || []).map(async (session) => {
      const { data: logs } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('session_id', session.id)
      return { ...session, exercise_logs: logs || [] }
    })
  )

  setSessions(sessionsWithLogs)
  setLoading(false)
}

  const totalDone = sessions.reduce((a, s) =>
    a + (s.exercise_logs?.filter(l => l.completed).length || 0), 0)

  return (
    <div>
      <div className="month-select">
        <select value={month} onChange={e => setMonth(Number(e.target.value))}>
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>{m} 2026</option>
          ))}
        </select>
      </div>

      <div className="stats-bar">
        <div className="stat-box"><div className="val">{sessions.length}</div><div className="lbl">Sessions</div></div>
        <div className="stat-box"><div className="val green">{totalDone}</div><div className="lbl">Exercises done</div></div>
        <div className="stat-box">
          <div className="val">
            {sessions.length > 0 ? Math.round(totalDone / sessions.length) : 0}
          </div>
          <div className="lbl">Avg / session</div>
        </div>
      </div>

      {loading && <div className="empty-state">Loading...</div>}
      {!loading && sessions.length === 0 && (
        <div className="empty-state">
          No sessions in {MONTHS[month]}.<br />Start training and save your progress!
        </div>
      )}

      {sessions.map(session => {
        const logs = session.exercise_logs || []
        const done = logs.filter(l => l.completed)
        const day = workoutPlan[session.day_key]
        return (
          <div key={session.id} className="session-card">
            <div className="session-header">
              <div>
                <div className="session-date">{session.date}</div>
                <div className="session-focus">{day?.label} — {day?.focus}</div>
              </div>
              <div className="session-count">{done.length}/{logs.length}</div>
            </div>
            {done.map(log => (
              <div key={log.id} className="session-ex-row">
                <span>✓ {log.exercise_name}</span>
                <span className="session-ex-meta">
                  {log.kg_used ? `${log.kg_used}kg` : ''}
                  {log.sets_done ? ` · ${log.sets_done}×${log.reps_done}` : ''}
                  {log.notes ? ` — ${log.notes}` : ''}
                </span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}