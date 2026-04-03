import './DayNav.css'

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
          <span className="day-nav-num">DAY {day.day}</span>
          <span className="day-nav-label">{day.label}</span>
        </button>
      ))}
    </nav>
  )
}
