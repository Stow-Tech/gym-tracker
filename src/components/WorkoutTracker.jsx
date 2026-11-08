import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { workoutPlan, DAY_KEYS, DAY_NUMBER } from '../workoutData'
import { toLb, describeSets, describeWeight } from '../units'

const DEFAULT_UNIT = 'lb'
const MAX_SETS = 8

function fmtDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Día del plan que toca hoy; si hoy no se entrena, el siguiente día del plan.
function todayKey() {
  const today = new Date().getDay()
  for (let i = 0; i < 7; i++) {
    const n = (today + i) % 7
    const key = DAY_KEYS.find(k => DAY_NUMBER[k] === n)
    if (key) return key
  }
  return DAY_KEYS[0]
}

// Fecha más reciente (hoy o antes) que cae en el día de la semana de ese día del plan.
function dateForDay(key) {
  const d = new Date()
  const diff = (d.getDay() - DAY_NUMBER[key] + 7) % 7
  d.setDate(d.getDate() - diff)
  return fmtDate(d)
}

function emptyLog(ex) {
  return { state: 'pending', weight: '', unit: DEFAULT_UNIT, reps: Array(ex.sets).fill(''), notes: '' }
}

function logHasData(log) {
  return log.weight !== '' || log.reps.some(r => r !== '') || log.notes !== ''
}

export default function WorkoutTracker({ user }) {
  const initialKey = todayKey()
  const [activeDay, setActiveDay] = useState(initialKey)
  const [date, setDate] = useState(dateForDay(initialKey))
  const [logs, setLogs] = useState({})
  const [lastSession, setLastSession] = useState({})
  const [bestLb, setBestLb] = useState({})
  const [existingSessionId, setExistingSessionId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)

  const plan = workoutPlan[activeDay]
  const allExercises = plan.sections.flatMap(s => s.exercises)

  useEffect(() => {
    loadSessionData()
    loadHistory()
  }, [activeDay, date])

  function selectDay(key) {
    setActiveDay(key)
    setDate(dateForDay(key))
  }

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
          const ex = allExercises.find(e => e.name === log.exercise_name)
          if (!ex) return
          let reps = Array.isArray(log.set_reps) && log.set_reps.length
            ? log.set_reps.map(String)
            : log.sets_done && log.reps_done
              ? Array(log.sets_done).fill(String(log.reps_done))
              : []
          while (reps.length < ex.sets) reps.push('')
          logsMap[log.exercise_name] = {
            state: log.completed ? 'done' : 'pending',
            weight: log.kg_used?.toString() || '',
            unit: log.unit || 'kg',
            reps,
            notes: log.notes || '',
          }
        })
        setLogs(logsMap)
      }
    }
    setLoading(false)
  }

  // Historial por ejercicio (no por día): "última vez" y mejor peso en lb,
  // aunque el ejercicio haya cambiado de día en el plan.
  async function loadHistory() {
    const names = allExercises.map(e => e.name)
    const { data: logRows } = await supabase
      .from('exercise_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true)
      .in('exercise_name', names)

    if (!logRows || logRows.length === 0) {
      setLastSession({})
      setBestLb({})
      return
    }

    const ids = [...new Set(logRows.map(l => l.session_id).filter(Boolean))]
    const { data: sessionRows } = await supabase
      .from('workout_sessions')
      .select('id, date')
      .in('id', ids)
      .lt('date', date)

    const dateById = Object.fromEntries((sessionRows || []).map(s => [s.id, s.date]))
    const lastMap = {}
    const bestMap = {}
    logRows.forEach(l => {
      const d = dateById[l.session_id]
      if (!d) return
      if (!lastMap[l.exercise_name] || d > lastMap[l.exercise_name].date) {
        lastMap[l.exercise_name] = { ...l, date: d }
      }
      const lb = toLb(l.kg_used, l.unit)
      if (lb !== null && (bestMap[l.exercise_name] === undefined || lb > bestMap[l.exercise_name])) {
        bestMap[l.exercise_name] = lb
      }
    })
    setLastSession(lastMap)
    setBestLb(bestMap)
  }

  function getLog(ex) {
    return logs[ex.name] || emptyLog(ex)
  }

  function updateLog(ex, changes) {
    setLogs(prev => {
      const current = prev[ex.name] || emptyLog(ex)
      const next = { ...current, ...changes }
      // Si capturas datos en un ejercicio pendiente, se marca como hecho solo.
      if (current.state === 'pending' && !('state' in changes) && logHasData(next)) {
        next.state = 'done'
      }
      return { ...prev, [ex.name]: next }
    })
  }

  function updateRep(ex, index, value) {
    const reps = [...getLog(ex).reps]
    reps[index] = value
    updateLog(ex, { reps })
  }

  function addSet(ex) {
    const reps = [...getLog(ex).reps]
    if (reps.length >= MAX_SETS) return
    updateLog(ex, { reps: [...reps, ''] })
  }

  function toggleState(ex) {
    const current = getLog(ex).state
    const next = current === 'pending' ? 'done' : current === 'done' ? 'skipped' : 'pending'
    updateLog(ex, { state: next })
  }

  function isPR(ex) {
    const log = getLog(ex)
    const best = bestLb[ex.name]
    const now = toLb(log.weight, log.unit)
    if (best === undefined || now === null) return false
    return now > best + 0.01
  }

  async function saveSession() {
    const anyActivity = allExercises.some(ex => {
      const log = getLog(ex)
      return log.state !== 'pending' || logHasData(log)
    })
    if (!anyActivity) {
      showToast('Marca o captura al menos un ejercicio antes de guardar')
      return
    }

    setSaving(true)
    try {
      let sessionId = existingSessionId
      let oldIds = []

      if (existingSessionId) {
        const { data: old } = await supabase
          .from('exercise_logs')
          .select('id')
          .eq('session_id', existingSessionId)
        oldIds = (old || []).map(o => o.id)
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
        const log = getLog(ex)
        const reps = log.reps
          .filter(r => r !== '')
          .map(r => parseFloat(r))
          .filter(r => !Number.isNaN(r))
        const avg = reps.length ? Math.round(reps.reduce((a, b) => a + b, 0) / reps.length) : null
        return {
          session_id: sessionId,
          user_id: user.id,
          exercise_name: ex.name,
          completed: log.state === 'done',
          kg_used: log.weight !== '' ? parseFloat(log.weight) : null,
          unit: log.unit,
          set_reps: reps.length ? reps : null,
          sets_done: reps.length || null,
          reps_done: avg,
          notes: log.notes || null,
        }
      })

      // Primero se insertan los nuevos y solo si salió bien se borran los viejos,
      // para no perder la sesión si algo falla a medias.
      const { error: lErr } = await supabase.from('exercise_logs').insert(rows)
      if (lErr) throw lErr
      if (oldIds.length) {
        const { error: dErr } = await supabase.from('exercise_logs').delete().in('id', oldIds)
        if (dErr) throw dErr
      }
      showToast(existingSessionId ? 'Session updated! 💪' : 'Session saved! 💪')
      loadHistory()
    } catch (e) {
      showToast('Error: ' + e.message)
    }
    setSaving(false)
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const doneCount = allExercises.filter(ex => getLog(ex).state === 'done').length
  const skippedCount = allExercises.filter(ex => getLog(ex).state === 'skipped').length
  const dateMismatch = new Date(date + 'T12:00:00').getDay() !== DAY_NUMBER[activeDay]

  return (
    <div>
      <div className="day-tabs">
        {DAY_KEYS.map(k => (
          <button key={k} className={`day-tab ${activeDay === k ? 'active' : ''}`}
            onClick={() => selectDay(k)}>
            {workoutPlan[k].label}{workoutPlan[k].optional ? ' (opcional)' : ''}
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
      {dateMismatch && (
        <div className="date-warn">
          Ojo: esa fecha no cae en {plan.label}. Si entrenaste otro día, puedes dejarla así.
        </div>
      )}

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
                const log = getLog(ex)
                const last = lastSession[ex.name]
                const pr = isPR(ex)
                const lastSets = last ? describeSets(last) : ''
                const lastWeight = last ? describeWeight(last) : ''
                return (
                  <div key={ex.name} className={`ex-card ${log.state}`}>
                    <div className="ex-top">
                      <button className={`check-btn ${log.state}`} onClick={() => toggleState(ex)}>
                        {log.state === 'done' ? '✓' : log.state === 'skipped' ? '✗' : ''}
                      </button>
                      <div className="ex-name">
                        {ex.name}
                        {pr && <span className="pr-badge">🏆 PR!</span>}
                      </div>
                    </div>
                    <div className="ex-plan">
                      Plan: {ex.sets} series × {ex.reps}{ex.timed ? '' : ' reps'} — Rest {ex.rest}
                    </div>
                    {last && (lastWeight || lastSets) && (
                      <div className="last-session">
                        Last time ({last.date}): {lastWeight || '—'}{lastSets ? ` · ${lastSets}` : ''}
                      </div>
                    )}

                    <div className="weight-row">
                      <div>
                        <label>Peso</label>
                        <input type="number" inputMode="decimal" step="0.5"
                          placeholder={last?.kg_used ? String(last.kg_used) : 'ej. 40'}
                          value={log.weight}
                          onChange={e => updateLog(ex, { weight: e.target.value })} />
                      </div>
                      <div>
                        <label>Unidad</label>
                        <select value={log.unit} onChange={e => updateLog(ex, { unit: e.target.value })}>
                          <option value="lb">lb</option>
                          <option value="kg">kg</option>
                        </select>
                      </div>
                    </div>

                    <label className="set-label">{ex.timed ? 'Segundos por serie' : 'Reps por serie'}</label>
                    <div className="set-inputs">
                      {log.reps.map((r, i) => (
                        <input key={i} type="number" inputMode="decimal" step="0.5"
                          placeholder={`S${i + 1}`} value={r}
                          onChange={e => updateRep(ex, i, e.target.value)} />
                      ))}
                      {log.reps.length < MAX_SETS && (
                        <button type="button" className="add-set" onClick={() => addSet(ex)}>+</button>
                      )}
                    </div>

                    <div className="ex-notes">
                      <label>Notes</label>
                      <input type="text" placeholder="ej. Subí peso, última de 8..."
                        value={log.notes} onChange={e => updateLog(ex, { notes: e.target.value })} />
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
