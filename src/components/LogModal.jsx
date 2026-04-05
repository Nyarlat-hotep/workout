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
const THUMB_INSET = 6
// How many pixels of drag = full range traversal. Higher = less sensitive.
const DRAG_PIXELS_PER_RANGE = 280

function VerticalSlider({ value, min, max, step, onChange }) {
  const trackRef = useRef()
  const dragState = useRef(null) // { startY, startValue }
  const latest = useRef({ min, max, step, onChange, value })
  latest.current = { min, max, step, onChange, value }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    function applyDelta(currentY) {
      const { min, max, step, startValue } = { ...latest.current, ...dragState.current }
      const delta = dragState.current.startY - currentY
      const rawChange = (delta / DRAG_PIXELS_PER_RANGE) * (max - min)
      const raw = startValue + rawChange
      const stepped = Math.round(raw / step) * step
      return parseFloat(Math.max(min, Math.min(max, stepped)).toFixed(2))
    }

    const onTouchStart = (e) => {
      dragState.current = { startY: e.touches[0].clientY, startValue: latest.current.value }
    }
    const onTouchMove = (e) => {
      if (!dragState.current) return
      e.preventDefault()
      latest.current.onChange(applyDelta(e.touches[0].clientY))
    }
    const onTouchEnd = () => { dragState.current = null }

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
    const startY = e.clientY
    const startValue = latest.current.value
    function applyDelta(currentY) {
      const { min, max, step } = latest.current
      const delta = startY - currentY
      const rawChange = (delta / DRAG_PIXELS_PER_RANGE) * (max - min)
      const raw = startValue + rawChange
      const stepped = Math.round(raw / step) * step
      return parseFloat(Math.max(min, Math.min(max, stepped)).toFixed(2))
    }
    latest.current.onChange(applyDelta(e.clientY))
    const onMove = (e) => latest.current.onChange(applyDelta(e.clientY))
    const onUp = () => {
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
      <div className="vslider-thumb" style={{ bottom: `clamp(${THUMB_INSET}px, calc(${percent}% - ${THUMB_HALF}px), calc(100% - ${THUMB_HALF * 2}px - ${THUMB_INSET}px))` }} />
    </div>
  )
}

function SetCard({ setData, setIndex, repsConfig, formatReps, onChange }) {
  return (
    <div className="log-set-card">
      <div className="log-set-card-label">Set {setIndex + 1}</div>
      <div className="log-sliders">
        <div className="log-slider-col">
          <div className="log-slider-value">{formatReps(setData.reps)}</div>
          <VerticalSlider
            value={setData.reps}
            min={repsConfig.min}
            max={repsConfig.max}
            step={1}
            onChange={v => onChange('reps', v)}
          />
          <div className="log-slider-label">Reps</div>
        </div>
        <div className="log-slider-col">
          <div className="log-slider-value">{setData.weight} lbs</div>
          <VerticalSlider
            value={setData.weight}
            min={0}
            max={200}
            step={2.5}
            onChange={v => onChange('weight', v)}
          />
          <div className="log-slider-label">Weight</div>
        </div>
      </div>
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
  const scrollRef = useRef()

  function updateSet(index, field, value) {
    setSets(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  function formatReps(val) {
    if (repsConfig.unit === 'sec') return `${val}s`
    if (repsConfig.unit === '/side') return `${val}/side`
    return String(val)
  }

  // Sync scroll position when activeSet changes via dot tap
  function goToSet(i) {
    setActiveSet(i)
    const el = scrollRef.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  // Update active dot as user swipes
  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    setActiveSet(i)
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

  return (
    <div className="log-screen">
      <div className="log-header">
        <span className="log-title">{exercise.name}</span>
        <button className="log-close" onClick={onClose}>✕</button>
      </div>

      <div className="log-date-row">
        <DatePicker value={date} onChange={setDate} />
      </div>

      <div className="log-dots">
        {sets.map((_, i) => (
          <button
            key={i}
            className={`log-dot${activeSet === i ? ' active' : ''}`}
            onClick={() => goToSet(i)}
            aria-label={`Set ${i + 1}`}
          />
        ))}
      </div>

      <div
        className="log-sets-scroll"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {sets.map((s, i) => (
          <SetCard
            key={i}
            setData={s}
            setIndex={i}
            repsConfig={repsConfig}
            formatReps={formatReps}
            onChange={(field, value) => updateSet(i, field, value)}
          />
        ))}
      </div>

      <div className="log-footer">
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
