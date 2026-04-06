import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import * as RadixSlider from '@radix-ui/react-slider'
import { supabase } from '../lib/supabase'
import DatePicker from './DatePicker'
import { markCompleted } from '../utils/completedExercises'
import './LogModal.css'

function today() {
  return new Date().toISOString().split('T')[0]
}

function parseRepsConfig(repsStr) {
  if (!repsStr || repsStr === 'max') return { min: 0, max: 16, start: 8, unit: 'reps' }
  const timeMatch = repsStr.match(/(\d+)s/)
  if (timeMatch) {
    const val = parseInt(timeMatch[1])
    return { min: 0, max: val * 2, start: val, unit: 'sec' }
  }
  const rangeMatch = repsStr.match(/(\d+)[–\-](\d+)/)
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1])
    return { min: 0, max: start * 2, start, unit: 'reps' }
  }
  const perSideMatch = repsStr.match(/(\d+)\/side/)
  if (perSideMatch) {
    const start = parseInt(perSideMatch[1])
    return { min: 0, max: start * 2, start, unit: '/side' }
  }
  const numMatch = repsStr.match(/^(\d+)$/)
  if (numMatch) {
    const start = parseInt(numMatch[1])
    return { min: 0, max: start * 2, start, unit: 'reps' }
  }
  return { min: 1, max: 30, start: 10, unit: 'reps' }
}

function GlassSlider({ value, min, max, step, onChange }) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100
  return (
    <RadixSlider.Root
      className="glass-slider-root"
      orientation="vertical"
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={([v]) => onChange(v)}
    >
      <RadixSlider.Track className="glass-slider-track">
        <RadixSlider.Range style={{ display: 'none' }} />
        <div className={`glass-slider-range${value === min ? ' glass-slider-range--empty' : ''}`} style={{ height: `clamp(70px, ${pct}%, calc(100% - 10px))` }} />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="glass-slider-thumb" />
    </RadixSlider.Root>
  )
}

function SetCard({ setData, setIndex, repsConfig, formatReps, onChange, bodyweight }) {
  return (
    <div className="log-set-card">
      <div className="log-sliders">
        <div className="log-slider-col">
          <div className="log-slider-value">{formatReps(setData.reps)}</div>
          <GlassSlider
            value={setData.reps}
            min={repsConfig.min}
            max={repsConfig.max}
            step={1}
            onChange={v => onChange('reps', v)}
          />
          <div className="log-slider-label">Reps</div>
        </div>
        {!bodyweight && (
          <div className="log-slider-col">
            <div className="log-slider-value">{setData.weight} lbs</div>
            <GlassSlider
              value={setData.weight}
              min={0}
              max={50}
              step={2.5}
              onChange={v => onChange('weight', v)}
            />
            <div className="log-slider-label">Weight</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Animated pill tab toggle ──────────────────────────────────────────────────
function SetTabs({ count, activeIndex, onChange }) {
  return (
    <div className="set-tabs">
      <div
        className="set-tabs-pill"
        style={{ transform: `translateX(calc(${activeIndex} * 100%))`, width: `calc((100% - 8px) / ${count})` }}
      />
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          className={`set-tab-btn${activeIndex === i ? ' active' : ''}`}
          onClick={() => onChange(i)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}

// ── Custom swipe carousel ─────────────────────────────────────────────────────
function SetCarousel({ sets, activeIndex, onActiveChange, repsConfig, formatReps, onChange, bodyweight }) {
  const containerRef = useRef()
  const swipe = useRef(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [animating, setAnimating] = useState(false)
  const count = sets.length

  function onTouchStart(e) {
    swipe.current = { startX: e.touches[0].clientX, startTime: Date.now() }
    setAnimating(false)
    setDragOffset(0)
  }

  function onTouchMove(e) {
    if (!swipe.current) return
    const dx = e.touches[0].clientX - swipe.current.startX
    const atStart = activeIndex === 0 && dx > 0
    const atEnd = activeIndex === count - 1 && dx < 0
    setDragOffset(atStart || atEnd ? dx * 0.18 : dx)
  }

  function onTouchEnd() {
    if (!swipe.current) return
    const elapsed = Date.now() - swipe.current.startTime
    const velocity = dragOffset / elapsed
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
            bodyweight={bodyweight}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
const SESSION_KEY = (name) => `log_progress_${name}`

export default function LogModal({ exercise, day, onClose, onSaved }) {
  const repsConfig = parseRepsConfig(exercise.reps)
  const [date, setDate] = useState(today())
  const [sets, setSets] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY(exercise.name))
      if (saved) return JSON.parse(saved)
    } catch {}
    return Array.from({ length: exercise.sets }, () => ({
      reps: repsConfig.start,
      weight: 0,
    }))
  })
  const [activeSet, setActiveSet] = useState(0)
  const [saving, setSaving] = useState(false)

  // Persist progress to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY(exercise.name), JSON.stringify(sets))
  }, [sets, exercise.name])

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
    sessionStorage.removeItem(SESSION_KEY(exercise.name))
    markCompleted(exercise.name)
    onSaved()
    onClose()
  }

  return (
    <div className="log-screen">
      <div className="log-header">
        <span className="log-title">{exercise.name}</span>
        <button className="log-close" onClick={onClose}><X size={18} strokeWidth={2} /></button>
      </div>

      <div className="log-prescription">
        <div className="exercise-card-info">
          {exercise.notes && <div className="exercise-notes">{exercise.notes}</div>}
        </div>
        <div className="exercise-badge">
          <span className="badge-sets">{exercise.sets} <X size={10} strokeWidth={2.5} /> {exercise.reps}</span>
        </div>
      </div>

      <div className="log-date-row">
        <DatePicker value={date} onChange={setDate} />
      </div>

      <div className="log-tabs-row">
        <SetTabs
          count={sets.length}
          activeIndex={activeSet}
          onChange={setActiveSet}
        />
      </div>

      <SetCarousel
        sets={sets}
        activeIndex={activeSet}
        onActiveChange={setActiveSet}
        repsConfig={repsConfig}
        formatReps={formatReps}
        bodyweight={exercise.bodyweight}
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
