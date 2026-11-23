import React, { useState, useEffect } from 'react'

/**
 * RobotHandWriter Component
 * 
 * Requirements:
 * 1. The static baseline has a sleek dark/black outline so the YUKTI '27 shape is already visible from frame 1.
 * 2. The laser beam sweeps from left to right along the letters, filling the letters with vibrant gradient color.
 * 3. Does not delay or block other hero content.
 */
export default function RobotHandWriter({ onComplete }) {
  const [fillPercent, setFillPercent] = useState(0)
  const [isEngraving, setIsEngraving] = useState(true)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current += 3.5
      if (current >= 100) {
        current = 100
        setFillPercent(100)
        setIsEngraving(false)
        clearInterval(interval)
        if (onComplete) onComplete()
      } else {
        setFillPercent(current)
      }
    }, 45)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="laser-yukti-wrap">
      {/* Background outlined text (visible immediately with dark outline) */}
      <h1 className="hero-single-line outlined-base-text" aria-hidden="true">
        YUKTI ’27
      </h1>

      {/* Laser-filled text overlay revealed by clip-path percentage */}
      <h1
        className="hero-single-line laser-filled-text"
        style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}
        aria-hidden="true"
      >
        YUKTI ’27
      </h1>

      {/* Travelling Laser Stylus Head & Sparks */}
      {isEngraving && (
        <div
          className="laser-cutting-point"
          style={{ left: `${fillPercent}%` }}
        >
          <span className="plasma-core" />
          <span className="plasma-beam-spark" />
          <span className="laser-trace-line" />
        </div>
      )}
    </div>
  )
}
