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

const THUMB_SIZE = 64
const THUMB_HALF = THUMB_SIZE / 2
const THUMB_INSET = 6

// ── Vertical slider — thumb tracks finger 1:1 relative to track height ──────
function VerticalSlider({ value, min, max, step, onChange }) {
  const trackRef = useRef()
  const dragState = useRef(null)
  const latest = useRef({ min, max, step, onChange, value })
  latest.current = { min, max, step, onChange, value }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    function clampStep(raw) {
      const { min, max, step } = latest.current
      const stepped = Math.round(raw / step) * step
      return parseFloat(Math.max(min, Math.min(max, stepped)).toFixed(2))
    }

    const onTouchStart = (e) => {
      const rect = el.getBoundingClientRect()
      dragState.current = {
        startY: e.touches[0].clientY,
        startValue: latest.current.value,
        // how many units per pixel, based on actual rendered track height
        unitsPerPx: (latest.current.max - latest.current.min) / rect.height,
      }
    }
    const onTouchMove = (e) => {
      if (!dragState.current) return
      e.preventDefault()
      const { startY, startValue, unitsPerPx } = dragState.current
      const deltaY = startY - e.touches[0].clientY
      latest.current.onChange(clampStep(startValue + deltaY * unitsPerPx))
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
    const rect = trackRef.current.getBoundingClientRect()
    const startY = e.clientY
    const startValue = latest.current.value
    const unitsPerPx = (latest.current.max - latest.current.min) / rect.height

    function clampStep(raw) {
      const { min, max, step } = latest.current
      return parseFloat(Math.max(min, Math.min(max, Math.round(raw / step) * step)).toFixed(2))
    }

    const onMove = (e) => {
      const deltaY = startY - e.clientY
      latest.current.onChange(clampStep(startValue + deltaY * unitsPerPx))
    }
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
      <div
        className="vslider-thumb"
        style={{
          bottom: `clamp(${THUMB_INSET}px, calc(${percent}% - ${THUMB_HALF}px), calc(100% - ${THUMB_SIZE}px - ${THUMB_INSET}px))`,
        }}
      />
    </div>
  )
}

// ── Set card ─────────────────────────────────────────────────────────────────
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

// ── Custom swipe carousel ─────────────────────────────────────────────────────
function SetCarousel({ sets, activeIndex, onActiveChange, repsConfig, formatReps, onChange }) {
  const containerRef = useRef()
  const swipe = useRef(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [animating, setAnimating] = useState(false)
  const count = sets.length

  function onTouchStart(e) {
    swipe.current = {
      startX: e.touches[0].clientX,
      startTime: Date.now(),
    }
    setAnimating(false)
    setDragOffset(0)
  }

  function onTouchMove(e) {
    if (!swipe.current) return
    const dx = e.touches[0].clientX - swipe.current.startX
    // rubber-band resistance at edges
    const atStart = activeIndex === 0 && dx > 0
    const atEnd = activeIndex === count - 1 && dx < 0
    setDragOffset(atStart || atEnd ? dx * 0.18 : dx)
  }

  function onTouchEnd() {
    if (!swipe.current) return
    const { startTime } = swipe.current
    const elapsed = Date.now() - startTime
    const velocity = dragOffset / elapsed // px/ms
    const width = containerRef.current?.clientWidth ?? 375
    const threshold = width * 0.28

    let next = activeIndex
    if (dragOffset < -threshold || velocity < -0.4) next = Math.min(count - 1, activeIndex + 1)
    else if (dragOffset > threshold || velocity > 0.4) next = Math.max(0, activeIndex - 1)

    swipe.current = null
    setDragOffset(0)
    setAnimating(true)
    onActiveChange(next)
  }

  const width = containerRef.current?.clientWidth ?? 0
  const baseTranslate = -activeIndex * 100
  const dragPercent = width ? (dragOffset / width) * 100 : 0
  const translateX = baseTranslate + dragPercent

  return (
    <div
      ref={containerRef}
      className="log-carousel"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="log-carousel-track"
        style={{
          transform: `translateX(${translateX}%)`,
          transition: animating ? 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
        }}
        onTransitionEnd={() => setAnimating(false)}
      >
        {sets.map((s, i) => (
          <SetCard
            key={i}
            setData={s}
            setIndex={i}
            repsConfig={repsConfig}
            formatReps={formatReps}
            onChange={(field, value) => onChange(i, field, value)}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
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
            onClick={() => setActiveSet(i)}
            aria-label={`Set ${i + 1}`}
          />
        ))}
      </div>

      <SetCarousel
        sets={sets}
        activeIndex={activeSet}
        onActiveChange={setActiveSet}
        repsConfig={repsConfig}
        formatReps={formatReps}
        onChange={(i, field, value) =>
          setSets(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s))
        }
      />

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
