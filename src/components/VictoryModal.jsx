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
    <div className="victory-modal-overlay" onClick={handleOverlayClick}>
      <div className="victory-modal-card">
        <button className="victory-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="victory-celebration">
          🎉
        </div>

        <h2 className="victory-title">Equation Solved!</h2>

        <div className="victory-message">
          You found that <strong>x = {solution}</strong>
        </div>

        <div className="victory-actions">
          {hasNextEquation && (
            <button
              className="victory-btn victory-btn-primary"
              onClick={onNextEquation}
            >
              Try Next Equation →
            </button>
          )}
          <button
            className="victory-btn victory-btn-secondary"
            onClick={onReset}
          >
            Reset This Equation
          </button>
        </div>
      </div>
    </div>
  )
}

export default VictoryModal
