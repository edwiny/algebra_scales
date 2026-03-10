import { calculateBalance } from '../utils/balanceLogic'
import Weight from './Weight'
import Balloon from './Balloon'
import './Scale.css'

function Scale({ leftSide, rightSide, setEquationState, solution }) {
  const balance = calculateBalance(leftSide, rightSide, solution)
  const balanceTilt = Math.max(-100, Math.min(100, balance * 20))

  const handleRemove = (side, indexToRemove) => {
    setEquationState((prev) => ({
      ...prev,
      [side]: prev[side].filter((_, index) => index !== indexToRemove)
    }))
  }

  const renderItems = (items, side) => {
    return items.map((item, index) => ({
      ...item,
      side,
      key: `${side}-${item.type}-${index}`,
      index,
    }))
  }

  const renderItemVisual = (item) => {
    if (item.type === 'weight') {
      return <Weight value={item.value} />
    }

    if (item.type === 'balloon') {
      return <Balloon value={item.value} />
    }

    return (
      <div className="unknown-triangle" aria-hidden="true">
        <span>x</span>
      </div>
    )
  }

  const leftItems = renderItems(leftSide, 'leftSide')
  const rightItems = renderItems(rightSide, 'rightSide')
  const balanceMessage = balance === 0
    ? 'Balanced'
    : balance > 0
      ? 'Right side is heavier'
      : 'Left side is heavier'

  return (
    <section className="scale-container" aria-label="Balance scale workspace">
      <div className="scale-topper">
        <div>
          <p className="balance-indicator">Goal: get x by itself on one side.</p>
          <p className="scale-instruction">Tap the small remove button under an item to take one away.</p>
        </div>

        <div className="balance-status" aria-live="polite">
          <span className="balance-status-label">Scale check</span>
          <strong>{balanceMessage}</strong>
        </div>
      </div>

      <div className="beam-meter" aria-hidden="true">
        <div className="beam-meter-track">
          <div className="beam-meter-indicator" style={{ transform: `translateX(${balanceTilt}%)` }} />
        </div>
      </div>

      <div className="scale-sides">
        <section className="scale-side left-side" aria-label="Left side of the scale">
          <div className="side-heading">
            <div>
              <div className="side-label">Left side</div>
              <div className="side-count">{leftItems.length} item{leftItems.length === 1 ? '' : 's'}</div>
            </div>
          </div>

          <div className="items-container">
            {leftItems.length === 0 && <div className="empty-placeholder">Nothing here yet</div>}
            {leftItems.map((item) => (
              <div key={item.key} className="item-chip">
                {renderItemVisual(item)}
                {item.type !== 'unknown' ? (
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => handleRemove(item.side, item.index)}
                    aria-label={`Remove one ${item.type} from the left side`}
                  >
                    Remove
                  </button>
                ) : (
                  <span className="item-chip-label">Unknown</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="fulcrum" aria-hidden="true">
          <div className="beam" style={{ transform: `rotate(${Math.max(-12, Math.min(12, balance * 5))}deg)` }} />
          <div className="pivot"></div>
        </div>

        <section className="scale-side right-side" aria-label="Right side of the scale">
          <div className="side-heading">
            <div>
              <div className="side-label">Right side</div>
              <div className="side-count">{rightItems.length} item{rightItems.length === 1 ? '' : 's'}</div>
            </div>
          </div>

          <div className="items-container">
            {rightItems.length === 0 && <div className="empty-placeholder">Nothing here yet</div>}
            {rightItems.map((item) => (
              <div key={item.key} className="item-chip">
                {renderItemVisual(item)}
                {item.type !== 'unknown' ? (
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => handleRemove(item.side, item.index)}
                    aria-label={`Remove one ${item.type} from the right side`}
                  >
                    Remove
                  </button>
                ) : (
                  <span className="item-chip-label">Unknown</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export default Scale



