import { useState } from 'react'
import './App.css'
import { WORKOUT } from './data/workout'
import DayNav from './components/DayNav'
import DayView from './components/DayView'
import LogsView from './components/LogsView'

export default function App() {
  const [selectedDay, setSelectedDay] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">TRAINING LOG</div>
        <div className="app-subtitle">// PROTOCOL ACTIVE //</div>
      </header>

      <main className="app-body">
        {selectedDay === 'logs'
          ? <LogsView />
          : <DayView day={WORKOUT[selectedDay]} />
        }
      </main>

      <DayNav days={WORKOUT} selected={selectedDay} onSelect={setSelectedDay} />
    </div>
  )
}
