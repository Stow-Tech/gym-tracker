import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setMessage('')
    let error

    if (mode === 'login') {
      const res = await supabase.auth.signInWithPassword({ email, password })
      error = res.error
    } else {
      const res = await supabase.auth.signUp({ email, password })
      error = res.error
      if (!error) setMessage('Check your email to confirm your account!')
    }

    if (error) setMessage(error.message)
    setLoading(false)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">💪</div>
        <h1 className="auth-title">Gym Tracker</h1>
        <p className="auth-sub">Tu gym y dieta en un solo lugar</p>

        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => { setMode('login'); setMessage('') }}
          >Login</button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => { setMode('signup'); setMessage('') }}
          >Crear cuenta</button>
        </div>

        <div className="auth-field">
          <label>Email</label>
          <input type="email" placeholder="tu@email.com" value={email}
            onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="auth-field">
          <label>Contraseña</label>
          <input type="password" placeholder="mínimo 6 caracteres" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        {message && (
          <div className={`auth-msg ${message.includes('Check') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </div>
    </div>
  )
}