import { useState, useRef, useEffect } from 'react'
import { X, Play, Pause, RotateCcw, Check, ThumbsUp } from 'lucide-react'
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

function SetCard({ setData, repsConfig, formatReps, onChange, bodyweight }) {
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

// ── Timed exercise view ───────────────────────────────────────────────────────
const TIMED_MESSAGES = [
  'Hold steady.\nBreathe through it.',
  'Stillness is\nthe work.',
  'Every second\ncounts.',
  'Stay present.\nDon\'t cut it short.',
]

function TimedView({ setIndex }) {
  return (
    <div className="timed-view">
      <p className="timed-msg">{TIMED_MESSAGES[setIndex % TIMED_MESSAGES.length]}</p>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
const SESSION_KEY = (name) => `log_progress_${name}`

export default function LogModal({ exercise, day, onClose, onSaved }) {
  const repsConfig = parseRepsConfig(exercise.reps)
  const isTimed = repsConfig.unit === 'sec'
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
  // 'idle' | 'saving' | 'success'
  const [completeState, setCompleteState] = useState('idle')
  const completeTimerRef = useRef(null)
  const [closing, setClosing] = useState(false)

  function handleClose() {
    setClosing(true)
    setTimeout(() => onClose(), 550)
  }

  // Stopwatch
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  function handleStartStop() {
    if (running) {
      clearInterval(intervalRef.current)
      setRunning(false)
    } else {
      startTimeRef.current = Date.now() - elapsed
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current)
      }, 50)
      setRunning(true)
    }
  }

  function handleReset() {
    clearInterval(intervalRef.current)
    setElapsed(0)
    setRunning(false)
  }

  function formatTime(ms) {
    const totalSecs = Math.floor(ms / 1000)
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    const cs = Math.floor((ms % 1000) / 10)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(cs).padStart(2, '0')}`
  }

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
    if (!date || completeState !== 'idle') return
    setCompleteState('saving')
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
    if (error) { alert('Failed to save. Please try again.'); setCompleteState('idle'); return }
    sessionStorage.removeItem(SESSION_KEY(exercise.name))
    markCompleted(exercise.name)
    onSaved()
    setCompleteState('success')
    completeTimerRef.current = setTimeout(() => {
      handleClose()
    }, 2000)
  }

  return (
    <div className={`log-screen${closing ? ' log-screen--closing' : ''}`}>
      <div className="log-bg" aria-hidden="true">
        <div className="log-blob log-blob--1" />
        <div className="log-blob log-blob--2" />
        <div className="log-blob log-blob--3" />
      </div>
      <div className="log-header">
        <span className="log-title">{exercise.name}</span>
        <button className="log-close" onClick={handleClose}><X size={18} strokeWidth={2} /></button>
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

      {isTimed
        ? <TimedView setIndex={activeSet} />
        : <SetCarousel
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
      }

      <div className="log-footer">
        <button
          className="log-footer-btn log-footer-btn--reset"
          onClick={handleReset}
          disabled={running || elapsed === 0}
        >
          <RotateCcw size={20} strokeWidth={2} />
        </button>
        <button
          className={`log-footer-btn log-footer-btn--playpause${running ? ' playing' : ''}`}
          onClick={handleStartStop}
        >
          {running ? <Pause size={20} strokeWidth={2} /> : <Play size={20} strokeWidth={2} />}
        </button>
        <div className="log-stopwatch">{formatTime(elapsed)}</div>
        <button
          className={`log-footer-btn log-footer-btn--complete${completeState === 'success' ? ' success' : ''}`}
          onClick={handleComplete}
          disabled={completeState !== 'idle' || !date}
        >
          <span className={`complete-icon complete-icon--check${completeState === 'success' ? ' exit' : ''}`}>
            <Check size={22} strokeWidth={2.5} />
          </span>
          <span className={`complete-icon complete-icon--thumb${completeState === 'success' ? ' enter' : ''}`}>
            <ThumbsUp size={22} strokeWidth={2.5} />
          </span>
        </button>
      </div>
    </div>
  )
}
