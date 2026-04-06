import { useState } from 'react'
import { GRIP_BLOCKS, GRIP_DAY } from '../data/grip'
import { getCompleted } from '../utils/completedExercises'
import BlockSection from './BlockSection'
import './GripView.css'

export default function GripView() {
  const [completed, setCompleted] = useState(() => getCompleted())

  function handleExerciseSaved() {
    setCompleted(getCompleted())
  }

  return (
    <div className="grip-view">
      <div className="grip-view-header">
        <span className="grip-view-title">GRIP TRAINING</span>
        <span className="grip-view-sub">// SUPPLEMENTAL PROTOCOL //</span>
      </div>
      {GRIP_BLOCKS.map(block => (
        <BlockSection
          key={block.id}
          block={block}
          day={GRIP_DAY}
          completed={completed}
          onExerciseSaved={handleExerciseSaved}
        />
      ))}
    </div>
  )
}
