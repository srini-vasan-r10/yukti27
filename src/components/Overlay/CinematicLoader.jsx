/**
 * CinematicLoader.jsx
 * Sophisticated Apple-inspired preloader curtain.
 */

import { useState, useEffect } from 'react'

export default function CinematicLoader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let val = 0
    const interval = setInterval(() => {
      val += Math.floor(Math.random() * 18) + 12
      if (val >= 100) {
        val = 100
        setProgress(100)
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          if (onComplete) onComplete()
        }, 350)
      } else {
        setProgress(val)
      }
    }, 70)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className={`cinematic-loader${done ? ' cinematic-loader--done' : ''}`} aria-hidden={done}>
      <h2 className="loader-brand">
        YUKTI <span>&rsquo;27</span>
      </h2>
      <p className="loader-sub">Where Strategy Takes Form</p>

      <div className="loader-progress-track">
        <div className="loader-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="loader-counter">{progress}%</div>
    </div>
  )
}
