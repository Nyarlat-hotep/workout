import { useState } from 'react'
import './BlockSection.css'
import ExerciseCard from './ExerciseCard'
import VideoModal from './VideoModal'
import LogModal from './LogModal'

export default function BlockSection({ block, day }) {
  const [videoExercise, setVideoExercise] = useState(null)
  const [logExercise, setLogExercise] = useState(null)

  return (
    <section className="block-section">
      <div className={`block-header${block.type === 'mobility' ? ' block-header--mobility' : ''}`}>
        <span className="block-name">{block.name}</span>
      </div>
      <div className="block-exercises">
        {block.exercises.map(ex => (
          <ExerciseCard
            key={ex.name}
            exercise={ex}
            onWatch={() => setVideoExercise(ex)}
            onLog={() => setLogExercise(ex)}
          />
        ))}
      </div>

      {videoExercise && (
        <VideoModal exercise={videoExercise} onClose={() => setVideoExercise(null)} />
      )}
      {logExercise && (
        <LogModal
          exercise={logExercise}
          day={day}
          onClose={() => setLogExercise(null)}
          onSaved={() => {}}
        />
      )}
    </section>
  )
}
