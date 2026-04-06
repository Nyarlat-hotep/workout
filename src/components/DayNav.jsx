import { Dumbbell, Footprints, ScrollText, MoveDown } from 'lucide-react'
import './DayNav.css'

const DAY_ICONS = [
  <Dumbbell size={22} strokeWidth={1.75} />,
  <MoveDown size={22} strokeWidth={1.75} />,
  <Footprints size={22} strokeWidth={1.75} />,
]

export default function DayNav({ days, selected, onSelect }) {
  return (
    <nav className="day-nav" aria-label="Training days">
      {days.map((day, i) => (
        <button
          key={i}
          className={`day-nav-tab${selected === i ? ' day-nav-tab--active' : ''}`}
          onClick={() => onSelect(i)}
          aria-pressed={selected === i}
        >
          <div className="day-nav-icon">{DAY_ICONS[i]}</div>
          <span className="day-nav-label">{day.label}</span>
        </button>
      ))}
      <button
        className={`day-nav-tab${selected === 'logs' ? ' day-nav-tab--active' : ''}`}
        onClick={() => onSelect('logs')}
        aria-pressed={selected === 'logs'}
      >
        <div className="day-nav-icon"><ScrollText size={22} strokeWidth={1.75} /></div>
        <span className="day-nav-label">LOGS</span>
      </button>
    </nav>
  )
}
