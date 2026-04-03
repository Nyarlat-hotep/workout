import './ExerciseCard.css'

export default function ExerciseCard({ exercise, isOpen, onToggle }) {
  const { name, sets, reps, notes, youtubeId } = exercise
  const setsReps = `${sets}×${reps}`

  return (
    <div className={`exercise-card${isOpen ? ' exercise-card--open' : ''}`}>
      {/* Always-visible header row */}
      <button
        className="exercise-card-header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="exercise-card-info">
          <div className="exercise-name">{name}</div>
          {notes && <div className="exercise-notes">{notes}</div>}
        </div>

        <div className="exercise-badge">
          <span className="badge-sets">{setsReps}</span>
          <span className="badge-label">SETS</span>
        </div>

        <span className="exercise-chevron" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {/* Accordion body */}
      <div className="exercise-body-wrap">
        <div className="exercise-body-inner">
          <div className="exercise-body">

            {youtubeId ? (
              <div className="exercise-video">
                {isOpen && (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                    title={`${name} demo`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                )}
              </div>
            ) : (
              <div className="exercise-no-video">
                <span className="exercise-no-video-label">// NO VIDEO LOADED //</span>
                <span className="exercise-no-video-hint">search: {exercise.searchHint}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
