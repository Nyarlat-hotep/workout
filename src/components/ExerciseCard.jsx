import { Play, Plus } from 'lucide-react'
import './ExerciseCard.css'

export default function ExerciseCard({ exercise, onLog }) {
  const { name, sets, reps, notes } = exercise

  function handleWatch() {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(name)}`, '_blank')
  }

  return (
    <div className="exercise-card">
      <div className="exercise-card-main">
        <div className="exercise-card-info">
          <div className="exercise-name">{name}</div>
          {notes && <div className="exercise-notes">{notes}</div>}
        </div>
        <div className="exercise-badge">
          <span className="badge-sets">{sets}×{reps}</span>
        </div>
      </div>
      <div className="exercise-actions">
        <button className="exercise-btn exercise-btn--watch" onClick={handleWatch}>
          <Play size={13} strokeWidth={2.5} /> Watch
        </button>
        <button className="exercise-btn exercise-btn--log" onClick={() => onLog(exercise)}>
          <Plus size={13} strokeWidth={2.5} /> Log
        </button>
      </div>
    </div>
  )
}
