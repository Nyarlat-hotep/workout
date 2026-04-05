import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './LogsView.css'

const DAY_OPTIONS = ['All', 'Push', 'Pull', 'Legs']

export default function LogsView() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDay, setFilterDay] = useState('All')
  const [filterDate, setFilterDate] = useState('')
  const [sortAsc, setSortAsc] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { fetchLogs() }, [])

  async function fetchLogs() {
    setLoading(true)
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .order('logged_date', { ascending: false })
      .order('exercise_name', { ascending: true })
      .order('set_number', { ascending: true })
    if (!error) setLogs(data ?? [])
    setLoading(false)
  }

  // Group by logged_date + day_label, then by exercise_name
  let filtered = logs
  if (filterDay !== 'All') filtered = filtered.filter(l => l.day_label === filterDay.toUpperCase())
  if (filterDate) filtered = filtered.filter(l => l.logged_date === filterDate)

  // Build grouped structure: { date: { day_label, exercises: { name: [sets] } } }
  const grouped = {}
  for (const log of filtered) {
    const key = `${log.logged_date}__${log.day_label}`
    if (!grouped[key]) grouped[key] = { date: log.logged_date, day_label: log.day_label, exercises: {} }
    if (!grouped[key].exercises[log.exercise_name]) grouped[key].exercises[log.exercise_name] = []
    grouped[key].exercises[log.exercise_name].push(log)
  }

  let sessions = Object.values(grouped).sort((a, b) =>
    sortAsc
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date)
  )

  const hasFilters = filterDay !== 'All' || filterDate

  return (
    <div className="logs-view">
      <div className="logs-toolbar">
        <button
          className={`logs-filter-btn${showFilters ? ' active' : ''}`}
          onClick={() => setShowFilters(f => !f)}
        >
          Filter {hasFilters ? '●' : ''}
        </button>
        <button
          className="logs-sort-btn"
          onClick={() => setSortAsc(a => !a)}
        >
          {sortAsc ? '↑ Oldest' : '↓ Newest'}
        </button>
      </div>

      {showFilters && (
        <div className="logs-filters">
          <div className="logs-filter-group">
            <span className="logs-filter-label">Day</span>
            <div className="logs-filter-pills">
              {DAY_OPTIONS.map(d => (
                <button
                  key={d}
                  className={`filter-pill${filterDay === d ? ' active' : ''}`}
                  onClick={() => setFilterDay(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="logs-filter-group">
            <span className="logs-filter-label">Date</span>
            <input
              className="logs-date-input"
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
            {filterDate && (
              <button className="logs-clear-date" onClick={() => setFilterDate('')}>✕</button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="logs-empty">Loading...</div>
      ) : sessions.length === 0 ? (
        <div className="logs-empty">No logs found.</div>
      ) : sessions.map(session => (
        <div key={`${session.date}__${session.day_label}`} className="log-session">
          <div className="log-session-header">
            <span className="log-session-date">{formatDate(session.date)}</span>
            <span className="log-session-day">{session.day_label}</span>
          </div>
          {Object.entries(session.exercises).map(([exName, sets]) => (
            <div key={exName} className="log-exercise-group">
              <div className="log-exercise-name">{exName}</div>
              <table className="log-sets-table">
                <thead>
                  <tr>
                    <th>Set</th>
                    <th>Reps</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {sets.map(s => (
                    <tr key={s.id}>
                      <td className="log-set-num">{s.set_number}</td>
                      <td>{s.reps}</td>
                      <td>{s.weight_lbs != null ? `${s.weight_lbs} lbs` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return new Date(Number(y), Number(m) - 1, Number(d))
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}
