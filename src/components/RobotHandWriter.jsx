import React, { useState, useEffect } from 'react'

/**
 * RobotHandWriter Component
 * Simulates an articulating cybernetic robotic stylus with laser plasma tip
 * drawing out "YUKTI '27" on canvas with particle sparks, followed by onComplete() trigger.
 */
export default function RobotHandWriter({ onComplete }) {
  const [writtenChars, setWrittenChars] = useState('')
  const [stylusPos, setStylusPos] = useState({ x: 0, y: 0 })
  const [isSparking, setIsSparking] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  const fullText = "YUKTI '27"

  useEffect(() => {
    let currentIndex = 0
    let timeoutId

    const typeNextChar = () => {
      if (currentIndex <= fullText.length) {
        setWrittenChars(fullText.slice(0, currentIndex))
        // Simulate relative stylus x displacement
        setStylusPos({
          x: (currentIndex / fullText.length) * 100,
          y: Math.sin(currentIndex * 1.5) * 6
        })
        currentIndex++
        timeoutId = setTimeout(typeNextChar, 140)
      } else {
        setIsSparking(false)
        setIsComplete(true)
        if (onComplete) onComplete()
      }
    }

    timeoutId = setTimeout(typeNextChar, 350)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="robo-writer-container">
      <div className="robo-laser-glow-track">
        <h1 className="hero-single-line laser-engraved-text">
          {writtenChars}
          {!isComplete && (
            <span className="cyber-stylus-head">
              <span className="laser-beam-nozzle" />
              <span className="laser-contact-spark" />
              <span className="stylus-arm-link" />
            </span>
          )}
        </h1>
      </div>
      {!isComplete && (
        <div className="robo-telemetry-badge mono">
          <span className="telemetry-dot" /> SYNTHETIC PROTOCOL // ENGRAVING SUMMIT IDENTITY...
        </div>
      )}
    </div>
  )
}
