import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import WorkoutTracker from './components/WorkoutTracker'
import ProgressView from './components/ProgressView'
import DietView from './components/DietView'
import SpeedView from './components/SpeedView'
import WeightView from './components/WeightView'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('gym')
  const [toast, setToast] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function todayDate() {
    return new Date().toISOString().split('T')[0]
  }

  async function exportToExcel() {
    try {
      // --- Fetch Workouts ---
      const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      const workoutRows = []
      for (const session of sessions || []) {
        const { data: logs } = await supabase
          .from('exercise_logs')
          .select('*')
          .eq('session_id', session.id)
        for (const log of logs || []) {
          workoutRows.push({
            Date: session.date,
            Day: session.day_key,
            Exercise: log.exercise_name,
            Completed: log.completed ? 'Yes' : 'No',
            'KG Used': log.kg_used || '',
            Sets: log.sets_done || '',
            Reps: log.reps_done || '',
            Notes: log.notes || '',
          })
        }
      }

      // --- Fetch Speed ---
      const { data: speedData } = await supabase
        .from('speed_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      const speedRows = (speedData || []).map(s => ({
        Date: s.date,
        'Speed (km/h)': s.speed,
      }))

      // --- Fetch Weight ---
      const { data: weightData } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      const weightRows = (weightData || []).map(w => ({
        Date: w.date,
        'Weight (kg)': w.weight,
      }))

      // --- Build Excel ---
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(workoutRows), 'Workouts')
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(speedRows), 'Speed')
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(weightRows), 'Weight')
      XLSX.writeFile(wb, `gym-tracker-${todayDate()}.xlsx`)
      showToast('Excel exported! 📊')
    } catch (e) {
      showToast('Error exporting: ' + e.message)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!user) return <Auth />

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gym Tracker 💪</h1>
        <nav className="app-nav">
          <button className={view === 'gym' ? 'active' : ''} onClick={() => setView('gym')}>Gym</button>
          <button className={view === 'diet' ? 'active' : ''} onClick={() => setView('diet')}>Diet</button>
          <button className={view === 'progress' ? 'active' : ''} onClick={() => setView('progress')}>Progress</button>
          <button className={`speed-btn ${view === 'speed' ? 'active' : ''}`} onClick={() => setView('speed')}>⚡ Speed</button>
          <button className={`weight-btn ${view === 'weight' ? 'active' : ''}`} onClick={() => setView('weight')}>⚖️ Weight</button>
          <button className="export-btn" onClick={exportToExcel}>📊 Excel</button>
          <button className="signout-btn" onClick={signOut}>Sign out</button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'gym' && <WorkoutTracker user={user} />}
        {view === 'diet' && <DietView user={user} />}
        {view === 'progress' && <ProgressView user={user} />}
        {view === 'speed' && <SpeedView user={user} />}
        {view === 'weight' && <WeightView user={user} />}
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}