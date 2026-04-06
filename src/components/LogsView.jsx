import { useEffect, useState } from 'react'
import { X, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import LogEditPage from './LogEditPage'
import './LogsView.css'

const DAY_OPTIONS = ['All', 'Push', 'Pull', 'Legs']

export default function LogsView() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDay, setFilterDay] = useState('All')
  const [filterDate, setFilterDate] = useState('')
  const [sortAsc, setSortAsc] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [editTarget, setEditTarget] = useState(null) // { exerciseName, sets }
  const [confirmDelete, setConfirmDelete] = useState(null) // { exerciseName, ids }

  useEffect(() => { fetchLogs() }, [])

  async function fetchLogs() {
    setLoading(true)
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .order('logged_date', { ascending: false })
      .order('created_at', { ascending: true })
      .order('set_number', { ascending: true })
    if (!error) setLogs(data ?? [])
    setLoading(false)
  }

  async function handleDelete() {
    const ids = confirmDelete.ids
    await supabase.from('workout_logs').delete().in('id', ids)
    setConfirmDelete(null)
    fetchLogs()
  }

  // Group by logged_date + day_label, then by exercise_name
  let filtered = logs
  if (filterDay !== 'All') filtered = filtered.filter(l => l.day_label === filterDay.toUpperCase())
  if (filterDate) filtered = filtered.filter(l => l.logged_date === filterDate)

  const grouped = {}
  for (const log of filtered) {
    const key = `${log.logged_date}__${log.day_label}`
    if (!grouped[key]) grouped[key] = { date: log.logged_date, day_label: log.day_label, exercises: {} }
    if (!grouped[key].exercises[log.exercise_name]) grouped[key].exercises[log.exercise_name] = []
    grouped[key].exercises[log.exercise_name].push(log)
  }

  let sessions = Object.values(grouped).sort((a, b) =>
    sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
  )

  const hasFilters = filterDay !== 'All' || filterDate

  if (editTarget) {
    return (
      <LogEditPage
        exerciseName={editTarget.exerciseName}
        sets={editTarget.sets}
        onClose={() => setEditTarget(null)}
        onSaved={() => { setEditTarget(null); fetchLogs() }}
      />
    )
  }

  return (
    <div className="logs-view">
      <div className="logs-toolbar">
        <button
          className={`logs-filter-btn${showFilters ? ' active' : ''}`}
          onClick={() => setShowFilters(f => !f)}
        >
          Filter {hasFilters ? '●' : ''}
        </button>
        <button className="logs-sort-btn" onClick={() => setSortAsc(a => !a)}>
          {sortAsc ? <><ArrowUp size={13} strokeWidth={2.5} /> Oldest</> : <><ArrowDown size={13} strokeWidth={2.5} /> Newest</>}
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
              <button className="logs-clear-date" onClick={() => setFilterDate('')}><X size={13} strokeWidth={2.5} /></button>
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
              <div className="log-exercise-header">
                <span className="log-exercise-name">{exName}</span>
                <div className="log-exercise-actions">
                  <button
                    className="log-action-btn log-action-btn--edit"
                    onClick={() => setEditTarget({ exerciseName: exName, sets })}
                  >
                    <Pencil size={14} strokeWidth={2} />
                  </button>
                  <button
                    className="log-action-btn log-action-btn--delete"
                    onClick={() => setConfirmDelete({ exerciseName: exName, ids: sets.map(s => s.id) })}
                  >
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
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

      {confirmDelete && (
        <div className="log-confirm-overlay">
          <div className="log-confirm-dialog">
            <div className="log-confirm-title">Delete logs?</div>
            <div className="log-confirm-body">
              Remove all sets for <strong>{confirmDelete.exerciseName}</strong>? This can't be undone.
            </div>
            <div className="log-confirm-actions">
              <button className="log-confirm-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="log-confirm-delete" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return new Date(Number(y), Number(m) - 1, Number(d))
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}
