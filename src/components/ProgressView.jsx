import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { dayInfo } from '../workoutData'
import { describeSets, describeWeight } from '../units'

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December']

export default function ProgressView({ user }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)

  async function fetchSessions() {
    setLoading(true)
    const mm = String(month + 1).padStart(2, '0')
    const from = `${year}-${mm}-01`
    const lastDay = String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')
    const to = `${year}-${mm}-${lastDay}`

    const { data: sessionsData, error: sErr } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: false })

    if (sErr) { setLoading(false); return }

    // Una sola consulta para todos los ejercicios del mes (antes era una por sesión).
    const ids = (sessionsData || []).map(s => s.id)
    let logsBySession = {}
    if (ids.length) {
      const { data: logs } = await supabase
        .from('exercise_logs')
        .select('*')
        .in('session_id', ids)
      ;(logs || []).forEach(l => {
        ;(logsBySession[l.session_id] = logsBySession[l.session_id] || []).push(l)
      })
    }

    setSessions((sessionsData || []).map(s => ({ ...s, exercise_logs: logsBySession[s.id] || [] })))
    setLoading(false)
  }

  useEffect(() => { fetchSessions() }, [month, year])

  const totalDone = sessions.reduce((a, s) =>
    a + (s.exercise_logs?.filter(l => l.completed).length || 0), 0)

  const years = [year - 1, year, year + 1].filter(y => y >= 2026)

  return (
    <div>
      <div className="month-select">
        <select value={month} onChange={e => setMonth(Number(e.target.value))}>
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
        <select value={year} onChange={e => setYear(Number(e.target.value))}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
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
          No sessions in {MONTHS[month]} {year}.<br />Start training and save your progress!
        </div>
      )}

      {sessions.map(session => {
        const logs = session.exercise_logs || []
        const done = logs.filter(l => l.completed)
        const day = dayInfo(session.day_key, session.date)
        return (
          <div key={session.id} className="session-card">
            <div className="session-header">
              <div>
                <div className="session-date">{session.date}</div>
                <div className="session-focus">{day?.label} — {day?.focus}</div>
              </div>
              <div className="session-count">{done.length}/{logs.length}</div>
            </div>
            {done.map(log => {
              const weight = describeWeight(log)
              const sets = describeSets(log)
              const parts = [weight, sets].filter(Boolean).join(' · ')
              return (
                <div key={log.id} className="session-ex-row">
                  <span>✓ {log.exercise_name}</span>
                  <span className="session-ex-meta">
                    {parts}
                    {log.notes ? `${parts ? ' — ' : ''}${log.notes}` : ''}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
