import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import './VictoryModal.css'

function VictoryModal({
  isVisible,
  solution,
  originalEquation,
  onNextEquation,
  onReset,
  onClose,
  hasNextEquation,
  isFinalEquation = false
}) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    let timerId

    if (isVisible) {
      const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!prefersReducedMotion) {
        confetti({
          particleCount: 220,
          spread: 75,
          startVelocity: 35,
          origin: { x: 0.5, y: 0.5 }
        })
      }

      const delay = prefersReducedMotion ? 0 : 1000
      timerId = setTimeout(() => setShowModal(true), delay)
    } else {
      setShowModal(false)
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [isVisible])

  if (!showModal) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="victory-modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
      aria-describedby="victory-message"
    >
      <div className="victory-modal-card">
        <button
          className="victory-close-btn"
          onClick={onClose}
          aria-label="Close victory modal"
        >
          Close
        </button>

        <div className="victory-badge" aria-hidden="true">Solved</div>

        <h2 id="victory-title" className="victory-title">
          {isFinalEquation ? '🎉 Victory!' : 'Nice work.'}
        </h2>

        <div id="victory-message" className="victory-message">
          {isFinalEquation ? (
            <strong>Well done, you solved all of the equations!</strong>
          ) : (
            <>
              Slay! You solved <strong>{originalEquation || 'the equation'}</strong> by isolating x and finding that <strong>x = {solution}</strong>.
            </>
          )}
        </div>

        <p className="victory-note">
          {isFinalEquation 
            ? 'Congratulations on completing all the challenges!' 
            : 'Reset to practice again or move on when you feel ready.'}
        </p>

        <div className="victory-actions" role="group" aria-label="Victory actions">
          {hasNextEquation && (
            <button
              className="victory-btn victory-btn-primary"
              onClick={onNextEquation}
              aria-label="Move to the next algebra equation"
            >
              Next equation
            </button>
          )}
          <button
            className="victory-btn victory-btn-secondary"
            onClick={onReset}
            aria-label={isFinalEquation ? 'Restart from the beginning' : 'Reset the current equation to try again'}
          >
            {isFinalEquation ? 'Restart from beginning' : 'Try this one again'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VictoryModal


