import { useState } from 'react'
import './BlockSection.css'
import ExerciseCard from './ExerciseCard'

export default function BlockSection({ block }) {
  const [openIdx, setOpenIdx] = useState(null)

  function handleToggle(i) {
    setOpenIdx(prev => prev === i ? null : i)
  }

  return (
    <section className="block-section">
      <div className={`block-header${block.type === 'mobility' ? ' block-header--mobility' : ''}`}>
        <span className="block-name">{block.name}</span>
        {block.duration && <span className="block-duration">{block.duration}</span>}
      </div>
      <div className="block-exercises">
        {block.exercises.map((ex, i) => (
          <ExerciseCard
            key={ex.name}
            exercise={ex}
            isOpen={openIdx === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </div>
    </section>
  )
}
