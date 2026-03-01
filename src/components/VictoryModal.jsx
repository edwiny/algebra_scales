import './VictoryModal.css'

function VictoryModal({
  isVisible,
  solution,
  onNextEquation,
  onReset,
  onClose,
  hasNextEquation
}) {
  if (!isVisible) return null

  const handleOverlayClick = (e) => {
    // Close modal if clicking on overlay (not the card)
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
          ×
        </button>

        <div className="victory-celebration" aria-hidden="true">
          🎉
        </div>

        <h2 id="victory-title" className="victory-title">Equation Solved!</h2>

        <div id="victory-message" className="victory-message">
          You found that <strong>x = {solution}</strong>
        </div>

        <div className="victory-actions" role="group" aria-label="Victory actions">
          {hasNextEquation && (
            <button
              className="victory-btn victory-btn-primary"
              onClick={onNextEquation}
              aria-label="Move to the next algebra equation"
            >
              Try Next Equation →
            </button>
          )}
          <button
            className="victory-btn victory-btn-secondary"
            onClick={onReset}
            aria-label="Reset the current equation to try again"
          >
            Reset This Equation
          </button>
        </div>
      </div>
    </div>
  )
}

export default VictoryModal
