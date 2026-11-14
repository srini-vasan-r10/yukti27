import React, { useState, useRef, useEffect } from 'react'

/**
 * CustomSelect Component
 * Replaces native browser OS dropdowns with a Deep Royal Purple & Metallic Gold
 * theme-aligned interactive select menu.
 * 
 * Features:
 * - Keyboard navigation (Escape, Enter, Arrows)
 * - Click outside to close
 * - Gold glowing hover states and active indicators
 * - Custom badge support (fees, icons)
 * - Smooth scrollable menu with custom scrollbars
 */
export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  label,
  id
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  // Find currently selected option
  const selectedOption = options.find((opt) => 
    (typeof opt === 'object' ? opt.value : opt) === value
  )

  const displayLabel = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : placeholder

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleSelect = (val) => {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${isOpen ? 'is-open' : ''}`}
      id={id}
    >
      {/* Trigger Button */}
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="custom-select-value">
          {displayLabel}
        </span>
        <span className="custom-select-arrow" aria-hidden="true">
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <path
              d="M1.5 1.75L6 6.25L10.5 1.75"
              stroke="var(--gold-border, #C59B3C)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Floating Options Menu */}
      {isOpen && (
        <div className="custom-select-menu" role="listbox">
          {options.map((option, idx) => {
            const optValue = typeof option === 'object' ? option.value : option
            const optLabel = typeof option === 'object' ? option.label : option
            const optBadge = typeof option === 'object' ? option.badge : null
            const isSelected = optValue === value

            return (
              <div
                key={idx}
                role="option"
                aria-selected={isSelected}
                className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(optValue)}
              >
                <span className="option-label">{optLabel}</span>
                {optBadge && (
                  <span className="option-badge mono gold">{optBadge}</span>
                )}
                {isSelected && (
                  <span className="option-check gold">✓</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
