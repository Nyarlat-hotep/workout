import { useState } from 'react'
import BlockSection from './BlockSection'
import './DayView.css'

export default function DayView({ day }) {
  const dayKey = day.label.toLowerCase()

  function getInitialVariant() {
    const lastVariant = localStorage.getItem(`variant_${dayKey}`) || 'A'
    const lastDate = localStorage.getItem(`date_${dayKey}`)
    const today = new Date().toISOString().split('T')[0]
    if (lastDate && lastDate < today) {
      return lastVariant === 'A' ? 'B' : 'A'
    }
    return lastVariant
  }

  const [variant, setVariant] = useState(getInitialVariant)

  function handleToggle(v) {
    setVariant(v)
    localStorage.setItem(`variant_${dayKey}`, v)
  }

  function handleExerciseSaved() {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(`variant_${dayKey}`, variant)
    localStorage.setItem(`date_${dayKey}`, today)
  }

  const blocks = day.variants[variant].blocks

  return (
    <div style={{ paddingTop: '8px' }}>
      <div className="variant-toggle-row">
        <div className="variant-toggle">
          <div
            className="variant-pill"
            style={{ transform: variant === 'B' ? 'translateX(100%)' : 'translateX(0)' }}
          />
          <button className={`variant-btn${variant === 'A' ? ' active' : ''}`} onClick={() => handleToggle('A')}>A</button>
          <button className={`variant-btn${variant === 'B' ? ' active' : ''}`} onClick={() => handleToggle('B')}>B</button>
        </div>
      </div>
      {blocks.map(block => (
        <BlockSection key={block.id} block={block} day={day} onExerciseSaved={handleExerciseSaved} />
      ))}
    </div>
  )
}
