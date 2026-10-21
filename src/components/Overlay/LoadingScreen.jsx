/**
 * LoadingScreen.jsx
 *
 * Full-screen loading overlay shown while 3D assets load.
 * Displays YUKTI '27 wordmark and a gold progress bar.
 *
 * Props:
 *   progress — number 0-100
 *   loaded   — boolean, triggers fade-out when true
 */

export default function LoadingScreen({ progress = 0, loaded = false }) {
  return (
    <div
      className={`loading-screen${loaded ? ' loading-screen--hidden' : ''}`}
      aria-hidden={loaded}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="loading-text">YUKTI &rsquo;27</span>

      <div className="loading-bar">
        <div
          className="loading-bar__fill"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  )
}
