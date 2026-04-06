import { Dumbbell, Footprints, ScrollText, MoveDown, Menu } from 'lucide-react'
import './DayNav.css'

const DAY_ICONS = [
  <Dumbbell size={22} strokeWidth={1.75} />,
  <MoveDown size={22} strokeWidth={1.75} />,
  <Footprints size={22} strokeWidth={1.75} />,
]

export default function DayNav({ days, selected, onSelect, onMenuOpen, menuOpen }) {
  return (
    <nav className="day-nav" aria-label="Training days">
      {days.map((day, i) => (
        <button
          key={i}
          className={`day-nav-tab${selected === i ? ' day-nav-tab--active' : ''}`}
          onClick={() => onSelect(i)}
          aria-pressed={selected === i}
        >
          <div className="day-nav-icon">{DAY_ICONS[i]}<span className="day-nav-label">{day.label}</span></div>
        </button>
      ))}
      <button
        className={`day-nav-tab${selected === 'logs' ? ' day-nav-tab--active' : ''}`}
        onClick={() => onSelect('logs')}
        aria-pressed={selected === 'logs'}
      >
        <div className="day-nav-icon"><ScrollText size={22} strokeWidth={1.75} /><span className="day-nav-label">LOGS</span></div>
      </button>
      <button
        className={`day-nav-tab${menuOpen || selected === 'grip' ? ' day-nav-tab--active' : ''}`}
        onClick={onMenuOpen}
        aria-pressed={menuOpen}
      >
        <div className="day-nav-icon"><Menu size={22} strokeWidth={1.75} /><span className="day-nav-label">MORE</span></div>
      </button>
    </nav>
  )
}
