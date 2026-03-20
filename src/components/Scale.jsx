import { useEffect, useRef, useState } from 'react'
import { calculateBalance } from '../utils/balanceLogic'
import confetti from 'canvas-confetti'
import Weight from './Weight'
import Balloon from './Balloon'
import LeftTerm from './LeftTerm'
import RightTerm from './RightTerm'
import Comparator from './Comparator'
import './Scale.css'
import './EquationTerm.css'

function Scale({
  leftSide,
  rightSide,
  solution,
  pendingRemoval,
  onRemoveItem,
  onCancelPendingRemoval,
  divideOperation,
  onDivide,
  equationState,
  isSolved,
  onNextEquation,
  hasNextEquation,
}) {
  const balance = calculateBalance(leftSide, rightSide, solution)
  const isPending = Boolean(pendingRemoval)
  const pendingSide = pendingRemoval?.fromSide
  const requiredType = pendingRemoval?.type
  const targetSide = pendingSide === 'leftSide' ? 'rightSide' : 'leftSide'
  const [wobble, setWobble] = useState(null)

  const comparisonOperator = balance === 0 ? '=' : balance > 0 ? '<' : '>'
  const tickRef = useRef(null)
  const prevIsSolvedRef = useRef(false)

  const handlePanClick = (side) => {
    if (isPending) return
    setWobble(side)
    setTimeout(() => setWobble(null), 500)
  }

  // Trigger confetti from the tick mark position when equation transitions to solved
  useEffect(() => {
    if (isSolved && !prevIsSolvedRef.current && tickRef.current) {
      const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!prefersReducedMotion) {
        const rect = tickRef.current.getBoundingClientRect()
        const x = rect.left / window.innerWidth
        const y = rect.top / window.innerHeight

        confetti({
          particleCount: 80,
          spread: 70,
          startVelocity: 30,
          origin: { x, y },
          colors: ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B']
        })
      }
    }
    
    prevIsSolvedRef.current = isSolved
  }, [isSolved])

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
    ? `Now remove a matching ${requiredType} from the ${targetSide === 'leftSide' ? 'left' : 'right'} side to keep the scales balanced.`
    : null
  const heavierSide = balance === 0 ? null : balance > 0 ? 'right' : 'left'
  const leftSideLabel = heavierSide === 'left' ? 'Left side is heavier!' : 'Left side'
  const rightSideLabel = heavierSide === 'right' ? 'Right side is heavier!' : 'Right side'

  return (
    <section
      className={`scale-container ${isPending ? 'scale-container-locked' : ''} ${isSolved ? 'equation-solved' : ''}`}
      aria-label="Balance scale workspace"
    >
      {/* Header with equation label and solved feedback */}
      <div className="scale-header">
        <div className="equation-label">Step 2 — solve the equation</div>
        {isSolved && (
          <div className="equation-solved-feedback">
            <div className="solved-tick" ref={tickRef} aria-hidden="true">
              ✓
            </div>
            {hasNextEquation && onNextEquation && (
              <button 
                className="next-equation-btn"
                onClick={onNextEquation}
                aria-label="Move to the next equation"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pending removal banner */}
      <div className="scale-topper">
        <div>
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
      </div>

      {/* 2×3 mobile / 3×2 desktop grid: pairs each pan with its equation term */}
      <div className="scale-grid">
        <section
          className={`scale-left-pan scale-side left-side ${heavierSide === 'left' ? 'scale-side-heavy' : ''} ${wobble ? 'scale-side-wobble' : ''}`}
          aria-label="Left side of the scale"
          onClick={() => handlePanClick('left')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handlePanClick('left')}
        >
          <div className="side-heading">
            <div>
              <div className="side-label">{leftSideLabel}</div>
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

        <div className="scale-left-term">
          <LeftTerm items={equationState?.leftSide || leftSide} />
        </div>

        <div className="scale-fulcrum fulcrum" aria-hidden="true">
          <div className="beam" style={{ transform: `rotate(${Math.max(-12, Math.min(12, balance * 5))}deg)` }} />
          <div className="pivot"></div>
        </div>

        <div className="scale-comparator">
          <Comparator operator={comparisonOperator} />
        </div>

        <section
          className={`scale-right-pan scale-side right-side ${heavierSide === 'right' ? 'scale-side-heavy' : ''} ${wobble ? 'scale-side-wobble' : ''}`}
          aria-label="Right side of the scale"
          onClick={() => handlePanClick('right')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handlePanClick('right')}
        >
          <div className="side-heading">
            <div>
              <div className="side-label">{rightSideLabel}</div>
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

        <div className="scale-right-term">
          <RightTerm items={equationState?.rightSide || rightSide} />
        </div>
      </div>

      {divideOperation && (
        <div className="divide-bar-container">
          <button
            type="button"
            className="divide-bar-button"
            onClick={onDivide}
            aria-label={`Divide both sides by ${divideOperation.divisor}`}
          >
            <span className="divide-bar-icon">÷</span>
            <span className="divide-bar-text">
              Divide both sides by {divideOperation.divisor}
            </span>
          </button>
        </div>
      )}
    </section>
  )
}

export default Scale
