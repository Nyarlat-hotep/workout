import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import DatePicker from './DatePicker'
import './LogModal.css'

function today() {
  return new Date().toISOString().split('T')[0]
}

function parseRepsConfig(repsStr) {
  if (!repsStr || repsStr === 'max') return { min: 5, max: 12, start: 8, unit: 'reps' }

  const timeMatch = repsStr.match(/(\d+)s/)
  if (timeMatch) {
    const val = parseInt(timeMatch[1])
    return { min: 0, max: val * 2, start: val, unit: 'sec' }
  }

  const rangeMatch = repsStr.match(/(\d+)[–\-](\d+)/)
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1])
    return { min: 1, max: Math.max(30, start * 3), start, unit: 'reps' }
  }

  const perSideMatch = repsStr.match(/(\d+)\/side/)
  if (perSideMatch) {
    const start = parseInt(perSideMatch[1])
    return { min: 1, max: Math.max(30, start * 3), start, unit: '/side' }
  }

  const numMatch = repsStr.match(/^(\d+)$/)
  if (numMatch) {
    const start = parseInt(numMatch[1])
    return { min: 1, max: Math.max(30, start * 3), start, unit: 'reps' }
  }

  return { min: 1, max: 30, start: 10, unit: 'reps' }
}

const THUMB_HALF = 32

function VerticalSlider({ value, min, max, step, onChange }) {
  const trackRef = useRef()
  const dragging = useRef(false)
  const latest = useRef({ min, max, step, onChange })
  latest.current = { min, max, step, onChange }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    function computeValue(clientY) {
      const { min, max, step } = latest.current
      const rect = el.getBoundingClientRect()
      const ratio = 1 - (clientY - rect.top) / rect.height
      const clamped = Math.max(0, Math.min(1, ratio))
      const raw = min + clamped * (max - min)
      const stepped = Math.round(raw / step) * step
      return parseFloat(Math.max(min, Math.min(max, stepped)).toFixed(2))
    }

    const onTouchStart = (e) => {
      dragging.current = true
      latest.current.onChange(computeValue(e.touches[0].clientY))
    }
    const onTouchMove = (e) => {
      if (!dragging.current) return
      e.preventDefault()
      latest.current.onChange(computeValue(e.touches[0].clientY))
    }
    const onTouchEnd = () => { dragging.current = false }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  function handleMouseDown(e) {
    dragging.current = true
    function compute(clientY) {
      const { min, max, step } = latest.current
      const rect = trackRef.current.getBoundingClientRect()
      const ratio = 1 - (clientY - rect.top) / rect.height
      const clamped = Math.max(0, Math.min(1, ratio))
      const raw = min + clamped * (max - min)
      return parseFloat(Math.max(min, Math.min(max, Math.round(raw / step) * step)).toFixed(2))
    }
    latest.current.onChange(compute(e.clientY))
    const onMove = (e) => { if (dragging.current) latest.current.onChange(compute(e.clientY)) }
    const onUp = () => {
      dragging.current = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const percent = ((value - min) / (max - min)) * 100

  return (
    <div className="vslider-track" ref={trackRef} onMouseDown={handleMouseDown}>
      <div className="vslider-fill" style={{ height: `${percent}%` }} />
      <div className="vslider-thumb" style={{ bottom: `calc(${percent}% - ${THUMB_HALF}px)` }} />
    </div>
  )
}

export default function LogModal({ exercise, day, onClose, onSaved }) {
  const repsConfig = parseRepsConfig(exercise.reps)

  const [date, setDate] = useState(today())
  const [sets, setSets] = useState(() =>
    Array.from({ length: exercise.sets }, () => ({
      reps: repsConfig.start,
      weight: 0,
    }))
  )
  const [activeSet, setActiveSet] = useState(0)
  const [saving, setSaving] = useState(false)

  function updateSet(field, value) {
    setSets(prev => prev.map((s, i) => i === activeSet ? { ...s, [field]: value } : s))
  }

  function formatReps(val) {
    if (repsConfig.unit === 'sec') return `${val}s`
    if (repsConfig.unit === '/side') return `${val}/side`
    return String(val)
  }

  async function handleComplete() {
    if (!date) return
    setSaving(true)
    const records = sets.map((s, i) => ({
      exercise_name: exercise.name,
      day_number: day.day,
      day_label: day.label,
      set_number: i + 1,
      reps: formatReps(s.reps),
      weight_lbs: s.weight === 0 ? null : s.weight,
      logged_date: date,
    }))
    const { error } = await supabase.from('workout_logs').insert(records)
    setSaving(false)
    if (error) { alert('Failed to save. Please try again.'); return }
    onSaved()
    onClose()
  }

  const current = sets[activeSet]

  return (
    <div className="log-screen">
      <div className="log-header">
        <span className="log-title">{exercise.name}</span>
        <button className="log-close" onClick={onClose}>✕</button>
      </div>

      <div className="log-set-tabs">
        {sets.map((_, i) => (
          <button
            key={i}
            className={`log-set-tab${activeSet === i ? ' active' : ''}`}
            onClick={() => setActiveSet(i)}
          >
            Set {i + 1}
          </button>
        ))}
      </div>

      <div className="log-sliders">
        <div className="log-slider-col">
          <div className="log-slider-value">{formatReps(current.reps)}</div>
          <VerticalSlider
            value={current.reps}
            min={repsConfig.min}
            max={repsConfig.max}
            step={1}
            onChange={v => updateSet('reps', v)}
          />
          <div className="log-slider-label">Reps</div>
        </div>
        <div className="log-slider-col">
          <div className="log-slider-value">{current.weight} lbs</div>
          <VerticalSlider
            value={current.weight}
            min={0}
            max={200}
            step={2.5}
            onChange={v => updateSet('weight', v)}
          />
          <div className="log-slider-label">Weight</div>
        </div>
      </div>

      <div className="log-footer">
        <DatePicker value={date} onChange={setDate} />
        <button
          className="log-complete-btn"
          onClick={handleComplete}
          disabled={saving || !date}
        >
          {saving ? 'Saving...' : 'Complete'}
        </button>
      </div>
    </div>
  )
}
