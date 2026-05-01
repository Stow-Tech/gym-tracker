import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { getDietForDay } from '../dietData'

const DAY_LABELS = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
  thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday'
}

const ALL_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

function todayKey() {
  const d = new Date().getDay()
  return ['sun','mon','tue','wed','thu','fri','sat'][d]
}

function todayDate() {
  return new Date().toISOString().split('T')[0]
}

export default function DietView({ user }) {
  const [activeDay, setActiveDay] = useState(todayKey())
  const [date, setDate] = useState(todayDate())
  const [completed, setCompleted] = useState({})
  const [notes, setNotes] = useState({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const meals = getDietForDay(activeDay)
  const totalKcal = meals.reduce((a, m) => a + m.kcal, 0)
  const doneKcal = meals.filter(m => completed[m.key]).reduce((a, m) => a + m.kcal, 0)

  useEffect(() => { setCompleted({}); setNotes({}) }, [activeDay, date])

  function toggleMeal(key) {
    setCompleted(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function saveDiet() {
    setSaving(true)
    try {
      const rows = meals.map(m => ({
        user_id: user.id,
        date,
        meal_key: m.key,
        completed: !!completed[m.key],
        notes: notes[m.key] || null,
      }))
      const { error } = await supabase.from('diet_logs').insert(rows)
      if (error) throw error
      showToast('Diet saved! ✅')
    } catch (e) {
      showToast('Error: ' + e.message)
    }
    setSaving(false)
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div>
      <div className="day-tabs" style={{ flexWrap: 'wrap' }}>
        {ALL_DAYS.map(k => (
          <button key={k} className={`day-tab ${activeDay === k ? 'active' : ''}`}
            onClick={() => setActiveDay(k)}>
            {DAY_LABELS[k]}
          </button>
        ))}
      </div>

      <div className="date-row">
        <span className="date-label">Date:</span>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className="stats-bar">
        <div className="stat-box"><div className="val">{totalKcal}</div><div className="lbl">Total kcal</div></div>
        <div className="stat-box"><div className="val green">{doneKcal}</div><div className="lbl">Completed kcal</div></div>
        <div className="stat-box">
          <div className="val">{meals.filter(m => completed[m.key]).length}/{meals.length}</div>
          <div className="lbl">Meals</div>
        </div>
      </div>

      {meals.map(meal => (
        <div key={meal.key} className={`ex-card ${completed[meal.key] ? 'done' : ''}`}>
          <div className="ex-top">
            <button className={`check-btn ${completed[meal.key] ? 'done' : ''}`}
              onClick={() => toggleMeal(meal.key)}>
              {completed[meal.key] ? '✓' : ''}
            </button>
            <div>
              <div className="ex-name">{meal.title}</div>
              <div className="ex-plan">{meal.time} — {meal.kcal} kcal</div>
            </div>
          </div>
          <ul className="diet-items">
            {meal.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className="ex-notes" style={{ marginTop: 8 }}>
            <label>Notes / changes today</label>
            <input type="text" placeholder="e.g. No avocado, used olive oil instead..."
              value={notes[meal.key] || ''}
              onChange={e => setNotes(prev => ({ ...prev, [meal.key]: e.target.value }))} />
          </div>
        </div>
      ))}

      <button className="save-btn" onClick={saveDiet} disabled={saving}>
        {saving ? 'Saving...' : 'Save diet day 💾'}
      </button>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}