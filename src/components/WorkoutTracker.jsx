import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { workoutPlan, DAY_KEYS } from '../workoutData'

// ✅ REPLACE these two functions at the top of WorkoutTracker.jsx

function todayKey() {
  const d = new Date()
  const day = d.getDay()
  return { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' }[day] || 'mon'
}

function todayDate() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function WorkoutTracker({ user }) {
  const [activeDay, setActiveDay] = useState(todayKey())
  const [date, setDate] = useState(todayDate())
  const [logs, setLogs] = useState({})
  const [lastSession, setLastSession] = useState({})
  const [existingSessionId, setExistingSessionId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)

  const plan = workoutPlan[activeDay]
  const allExercises = plan.sections.flatMap(s => s.exercises)

  useEffect(() => {
    loadSessionData()
    loadLastSession()
  }, [activeDay, date])

  async function loadSessionData() {
    setLoading(true)
    setLogs({})
    setExistingSessionId(null)

    const { data: sessions } = await supabase
  .from('workout_sessions')
  .select('*')
  .eq('user_id', user.id)
  .eq('date', date)
  .eq('day_key', activeDay)
  .limit(1)

const session = sessions?.[0] || null

    if (session) {
      setExistingSessionId(session.id)
      const { data: exerciseLogs } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('session_id', session.id)

      if (exerciseLogs) {
        const logsMap = {}
        exerciseLogs.forEach(log => {
          logsMap[log.exercise_name] = {
            state: log.completed ? 'done' : 'skipped',
            kg: log.kg_used?.toString() || '',
            sets: log.sets_done?.toString() || '',
            reps: log.reps_done?.toString() || '',
            notes: log.notes || '',
          }
        })
        setLogs(logsMap)
      }
    }
    setLoading(false)
  }

  async function loadLastSession() {
    const { data: sessions } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('day_key', activeDay)
      .lt('date', date)
      .order('date', { ascending: false })
      .limit(1)

    if (sessions && sessions.length > 0) {
      const { data: exerciseLogs } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('session_id', sessions[0].id)

      if (exerciseLogs) {
        const lastMap = {}
        exerciseLogs.forEach(log => {
          lastMap[log.exercise_name] = {
            kg: log.kg_used,
            sets: log.sets_done,
            reps: log.reps_done,
            date: sessions[0].date,
          }
        })
        setLastSession(lastMap)
      }
    } else {
      setLastSession({})
    }
  }

  function getLog(name) {
    return logs[name] || { state: 'pending', kg: '', sets: '', reps: '', notes: '' }
  }

  function updateLog(name, field, value) {
    setLogs(prev => ({ ...prev, [name]: { ...getLog(name), [field]: value } }))
  }

  function toggleState(name) {
    const current = getLog(name).state
    const next = current === 'pending' ? 'done' : current === 'done' ? 'skipped' : 'pending'
    updateLog(name, 'state', next)
  }

  function isPR(name) {
    const log = getLog(name)
    const last = lastSession[name]
    if (!last || !log.kg || !last.kg) return false
    return parseFloat(log.kg) > parseFloat(last.kg)
  }

  async function saveSession() {
    setSaving(true)
    try {
      let sessionId = existingSessionId

      if (existingSessionId) {
        await supabase
          .from('exercise_logs')
          .delete()
          .eq('session_id', existingSessionId)
      } else {
        const { data: session, error: sErr } = await supabase
          .from('workout_sessions')
          .insert({ date, day_key: activeDay, user_id: user.id })
          .select().single()
        if (sErr) throw sErr
        sessionId = session.id
        setExistingSessionId(session.id)
      }

      const rows = allExercises.map(ex => {
        const log = getLog(ex.name)
        return {
          session_id: sessionId,
          user_id: user.id,
          exercise_name: ex.name,
          completed: log.state === 'done',
          kg_used: log.kg ? parseFloat(log.kg) : null,
          sets_done: log.sets ? parseInt(log.sets) : null,
          reps_done: log.reps ? parseInt(log.reps) : null,
          notes: log.notes || null,
        }
      })

      const { error: lErr } = await supabase.from('exercise_logs').insert(rows)
      if (lErr) throw lErr
      showToast(existingSessionId ? 'Session updated! 💪' : 'Session saved! 💪')
    } catch (e) {
      showToast('Error: ' + e.message)
    }
    setSaving(false)
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const doneCount = allExercises.filter(ex => getLog(ex.name).state === 'done').length
  const skippedCount = allExercises.filter(ex => getLog(ex.name).state === 'skipped').length

  return (
    <div>
      <div className="day-tabs">
        {DAY_KEYS.map(k => (
          <button key={k} className={`day-tab ${activeDay === k ? 'active' : ''}`}
            onClick={() => setActiveDay(k)}>
            {workoutPlan[k].label}
            <div className="tab-sub">{workoutPlan[k].focus.split('—')[0].trim()}</div>
          </button>
        ))}
      </div>

      <div className="date-row">
        <span className="date-label">Date:</span>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        {existingSessionId && (
          <span className="saved-badge">✓ Saved</span>
        )}
      </div>

      {loading ? (
        <div className="empty-state">Loading session...</div>
      ) : (
        <>
          <div className="stats-bar">
            <div className="stat-box"><div className="val">{allExercises.length}</div><div className="lbl">Total</div></div>
            <div className="stat-box"><div className="val green">{doneCount}</div><div className="lbl">Done</div></div>
            <div className="stat-box"><div className="val orange">{skippedCount}</div><div className="lbl">Skipped</div></div>
            <div className="stat-box"><div className="val">{allExercises.length - doneCount - skippedCount}</div><div className="lbl">Pending</div></div>
          </div>

          {plan.sections.map(section => (
            <div key={section.title}>
              <div className="section-label">{section.title}</div>
              {section.exercises.map(ex => {
                const log = getLog(ex.name)
                const last = lastSession[ex.name]
                const pr = isPR(ex.name)
                return (
                  <div key={ex.name} className={`ex-card ${log.state}`}>
                    <div className="ex-top">
                      <button className={`check-btn ${log.state}`} onClick={() => toggleState(ex.name)}>
                        {log.state === 'done' ? '✓' : log.state === 'skipped' ? '✗' : ''}
                      </button>
                      <div className="ex-name">
                        {ex.name}
                        {pr && <span className="pr-badge">🏆 PR!</span>}
                      </div>
                    </div>
                    <div className="ex-plan">
                      Plan: {ex.sets} series × {ex.reps} reps — Rest {ex.rest}
                    </div>
                    {last && (
                      <div className="last-session">
                        Last time ({last.date}): {last.kg ? `${last.kg}kg` : '—'} · {last.sets}×{last.reps}
                      </div>
                    )}
                    <div className="ex-inputs">
                      <div>
                        <label>KG usado</label>
                        <input type="number" placeholder={last?.kg || 'ej. 40'} value={log.kg}
                          onChange={e => updateLog(ex.name, 'kg', e.target.value)} />
                      </div>
                      <div>
                        <label>Series reales</label>
                        <input type="number" placeholder={last?.sets || ex.sets} value={log.sets}
                          onChange={e => updateLog(ex.name, 'sets', e.target.value)} />
                      </div>
                      <div>
                        <label>Reps reales</label>
                        <input type="number" placeholder={last?.reps || ex.reps} value={log.reps}
                          onChange={e => updateLog(ex.name, 'reps', e.target.value)} />
                      </div>
                    </div>
                    <div className="ex-notes">
                      <label>Notes</label>
                      <input type="text" placeholder="ej. Subí peso, última de 8..."
                        value={log.notes} onChange={e => updateLog(ex.name, 'notes', e.target.value)} />
                    </div>
                  </div>
                )
              })}
            </div>
          ))}

          <button className="save-btn" onClick={saveSession} disabled={saving}>
            {saving ? 'Saving...' : existingSessionId ? 'Update session 💾' : 'Save session 💾'}
          </button>
        </>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}