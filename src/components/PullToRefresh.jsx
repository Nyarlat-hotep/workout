import { useRef, useState, useCallback, useEffect } from 'react'
import './PullToRefresh.css'

const THRESHOLD = 72
const MAX_PULL  = 100

export default function PullToRefresh({ scrollRef, children }) {
  const [pullY, setPullY]         = useState(0)
  const [triggered, setTriggered] = useState(false)
  const rootRef  = useRef(null)
  const startY   = useRef(null)
  const pulling  = useRef(false)
  const pullYRef = useRef(0)       // track latest value without re-render lag

  const onTouchStart = useCallback((e) => {
    if (scrollRef.current?.scrollTop !== 0) return
    startY.current  = e.touches[0].clientY
    pulling.current = true
  }, [scrollRef])

  const onTouchMove = useCallback((e) => {
    if (!pulling.current || startY.current === null) return
    const dy = e.touches[0].clientY - startY.current
    if (dy <= 0) { pulling.current = false; return }
    e.preventDefault()   // works because listener is non-passive (see useEffect)
    const clamped = Math.min(dy * 0.55, MAX_PULL)
    pullYRef.current = clamped
    setPullY(clamped)
    setTriggered(clamped >= THRESHOLD)
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!pulling.current) return
    pulling.current = false
    startY.current  = null
    const wasTriggered = pullYRef.current >= THRESHOLD
    if (wasTriggered) {
      setPullY(THRESHOLD * 0.6)
      setTimeout(() => window.location.reload(), 220)
    } else {
      setPullY(0)
      setTriggered(false)
    }
    pullYRef.current = 0
  }, [])

  // Register touchmove as non-passive so preventDefault() works
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove',  onTouchMove,  { passive: false })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
      el.removeEventListener('touchend',   onTouchEnd)
    }
  }, [onTouchStart, onTouchMove, onTouchEnd])

  const progress  = Math.min(pullY / THRESHOLD, 1)
  const isVisible = pullY > 2

  return (
    <div className="ptr-root" ref={rootRef}>
      {/* Pull indicator */}
      <div
        className={`ptr-indicator${triggered ? ' ptr-indicator--ready' : ''}`}
        style={{ height: `${pullY}px`, opacity: progress }}
        aria-hidden="true"
      >
        {isVisible && (
          <div className="ptr-icon" style={{ transform: `rotate(${progress * 180}deg)` }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2v10M9 2L6 5M9 2l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="14" r="1.5" fill="currentColor" opacity="0.5"/>
            </svg>
          </div>
        )}
      </div>

      {/* Content shifts down during pull */}
      <div style={{
        transform: `translateY(${pullY}px)`,
        transition: pulling.current ? 'none' : 'transform 0.25s ease',
      }}>
        {children}
      </div>
    </div>
  )
}
