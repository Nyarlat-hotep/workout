import { useState, useRef } from 'react'
import './App.css'
import { WORKOUT } from './data/workout'
import DayNav from './components/DayNav'
import DayView from './components/DayView'
import PullToRefresh from './components/PullToRefresh'

export default function App() {
  const [selectedDay, setSelectedDay] = useState(0)
  const scrollRef = useRef(null)

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">TRAINING LOG</div>
        <div className="app-subtitle">// PROTOCOL ACTIVE //</div>
      </header>

      <main className="app-body" ref={scrollRef}>
        <PullToRefresh scrollRef={scrollRef}>
          <DayView day={WORKOUT[selectedDay]} />
        </PullToRefresh>
      </main>

      <DayNav days={WORKOUT} selected={selectedDay} onSelect={setSelectedDay} />
    </div>
  )
}
