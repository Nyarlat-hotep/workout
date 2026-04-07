import { useState, useEffect } from 'react'
import { Sun, Moon, LogOut } from 'lucide-react'
import './App.css'
import { WORKOUT } from './data/workout'
import { supabase } from './lib/supabase'
import DayNav from './components/DayNav'
import DayView from './components/DayView'
import LogsView from './components/LogsView'
import GripView from './components/GripView'
import SideMenu from './components/SideMenu'
import LoginPage from './components/LoginPage'

export default function App() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  if (session === undefined) return null
  if (session === null) return <LoginPage />

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <div className="app-title">TRAINING LOG</div>
          <div className="app-subtitle">// PROTOCOL ACTIVE //</div>
        </div>
        <div className="app-header-actions">
          <button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
          </button>
          <button className="theme-toggle" onClick={() => supabase.auth.signOut()} title="Sign out">
            <LogOut size={16} strokeWidth={2} />
          </button>
        </div>
      </header>

      <main className="app-body">
        {selectedDay === 'logs'
          ? <LogsView />
          : selectedDay === 'grip'
          ? <GripView />
          : <DayView day={WORKOUT[selectedDay]} />
        }
      </main>

      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={setSelectedDay}
      />
      <DayNav
        days={WORKOUT}
        selected={selectedDay}
        onSelect={setSelectedDay}
        onMenuOpen={() => setMenuOpen(true)}
        menuOpen={menuOpen}
      />
    </div>
  )
}
