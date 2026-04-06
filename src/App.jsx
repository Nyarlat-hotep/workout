import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import './App.css'
import { WORKOUT } from './data/workout'
import DayNav from './components/DayNav'
import DayView from './components/DayView'
import LogsView from './components/LogsView'
import GripView from './components/GripView'
import SideMenu from './components/SideMenu'

export default function App() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <div className="app-title">TRAINING LOG</div>
          <div className="app-subtitle">// PROTOCOL ACTIVE //</div>
        </div>
        <button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
        </button>
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
