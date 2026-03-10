import { calculateBalance } from '../utils/balanceLogic'
import Weight from './Weight'
import Balloon from './Balloon'
import './Scale.css'

function Scale({
  leftSide,
  rightSide,
  setEquationState,
  solution,
  pendingRemoval,
  onRemoveItem,
  onCancelPendingRemoval,
}) {
  const balance = calculateBalance(leftSide, rightSide, solution)
  const isPending = Boolean(pendingRemoval)
  const pendingSide = pendingRemoval?.fromSide
  const requiredType = pendingRemoval?.type
  const targetSide = pendingSide === 'leftSide' ? 'rightSide' : 'leftSide'

  const handleRemove = (side, indexToRemove, item) => {
    if (isPending) {
      const isMatchingSide = side === targetSide
      const isMatchingType = item.type === requiredType

      if (!isMatchingSide || !isMatchingType) {
        return
      }
    }

    onRemoveItem(side, indexToRemove, item)
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
  const pendingMessage = isPending
    ? `You removed a ${requiredType}. Now remove a matching ${requiredType} from the ${targetSide === 'leftSide' ? 'left' : 'right'} side.`
    : null
  const balanceMessage = balance === 0
    ? 'Balanced'
    : balance > 0
      ? 'Right side is heavier'
      : 'Left side is heavier'

  return (
    <section
      className={`scale-container ${isPending ? 'scale-container-locked' : ''}`}
      aria-label="Balance scale workspace"
    >
      <div className="scale-topper">
        <div>
          <p className="balance-indicator">Goal: get x by itself on one side.</p>
          <p className="scale-instruction">Tap the small remove button under an item to take one away.</p>
          {pendingMessage && (
            <div className="pending-removal-banner" role="status" aria-live="polite">
              <span>{pendingMessage}</span>
              <button
                type="button"
                className="pending-cancel-button"
                onClick={onCancelPendingRemoval}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="balance-status" aria-live="polite">
          <span className="balance-status-label">Scale check</span>
          <strong>{balanceMessage}</strong>
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
            {leftItems.map((item) => {
              const isTarget = isPending && item.side === targetSide && item.type === requiredType
              const isLockedItem = isPending && !isTarget

              return (
                <div
                  key={item.key}
                  className={`item-chip ${isTarget ? 'item-chip-target' : ''} ${isLockedItem ? 'item-chip-locked' : ''}`}
                >
                {renderItemVisual(item)}
                {item.type !== 'unknown' ? (
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => handleRemove(item.side, item.index, item)}
                    aria-label={`Remove one ${item.type} from the left side`}
                    disabled={isPending && (!isTarget || item.side !== targetSide)}
                  >
                    Remove
                  </button>
                ) : (
                  <span className="item-chip-label">Unknown</span>
                )}
                </div>
              )
            })}
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
            {rightItems.map((item) => {
              const isTarget = isPending && item.side === targetSide && item.type === requiredType
              const isLockedItem = isPending && !isTarget

              return (
                <div
                  key={item.key}
                  className={`item-chip ${isTarget ? 'item-chip-target' : ''} ${isLockedItem ? 'item-chip-locked' : ''}`}
                >
                {renderItemVisual(item)}
                {item.type !== 'unknown' ? (
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => handleRemove(item.side, item.index, item)}
                    aria-label={`Remove one ${item.type} from the right side`}
                    disabled={isPending && (!isTarget || item.side !== targetSide)}
                  >
                    Remove
                  </button>
                ) : (
                  <span className="item-chip-label">Unknown</span>
                )}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </section>
  )
}

export default Scale





