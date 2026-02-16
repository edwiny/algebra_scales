import { calculateBalance } from '../utils/balanceLogic'
import Weight from './Weight'
import Balloon from './Balloon'
import './Scale.css'

function Scale({ leftSide, rightSide, setEquationState, solution }) {
  const balance = calculateBalance(leftSide, rightSide, solution)

  // Handle removing an item from left side
  const handleRemoveFromLeft = (indexToRemove) => {
    setEquationState(prev => ({
      ...prev,
      leftSide: prev.leftSide.filter((_, index) => index !== indexToRemove)
    }))
  }

  // Handle removing an item from right side
  const handleRemoveFromRight = (indexToRemove) => {
    setEquationState(prev => ({
      ...prev,
      rightSide: prev.rightSide.filter((_, index) => index !== indexToRemove)
    }))
  }

  // Handle drop on left side
  const handleDropLeft = (e) => {
    e.preventDefault()
    const itemType = e.dataTransfer.getData('itemType')
    const itemValue = parseInt(e.dataTransfer.getData('itemValue'), 10)

    const newItem = {
      type: itemType,
      value: itemValue
    }

    setEquationState(prev => ({
      ...prev,
      leftSide: [...prev.leftSide, newItem]
    }))

    e.currentTarget.classList.remove('drag-over')
  }

  // Handle drop on right side
  const handleDropRight = (e) => {
    e.preventDefault()
    const itemType = e.dataTransfer.getData('itemType')
    const itemValue = parseInt(e.dataTransfer.getData('itemValue'), 10)

    const newItem = {
      type: itemType,
      value: itemValue
    }

    setEquationState(prev => ({
      ...prev,
      rightSide: [...prev.rightSide, newItem]
    }))

    e.currentTarget.classList.remove('drag-over')
  }

  // Allow drop
  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over')
  }

  // Helper function to render items (now they're already individual units in state)
  const renderItems = (items) => {
    return items.map((item, index) => ({
      ...item,
      key: `${item.type}-${index}`,
      index: index
    }))
  }

  const leftItems = renderItems(leftSide)
  const rightItems = renderItems(rightSide)

  return (
    <div className="scale-container">
      <div className="balance-indicator">
        <span>Balance: {balance === 0 ? '⚖️ Balanced' : balance > 0 ? '↘️ Right heavier' : '↖️ Left heavier'}</span>
      </div>
      <div className="scale-instruction">
        Click on any item to remove it from the scale
      </div>

      <div className="scale">
        <div className="scale-side left-side">
          <div className="side-label">Left Side</div>
          <div
            className="items-container"
            onDrop={handleDropLeft}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {leftItems.map((item) => (
              item.type === 'weight' ? (
                <div
                  key={item.key}
                  className="removable-item"
                  onClick={() => handleRemoveFromLeft(item.index)}
                  title="Click to remove"
                >
                  <Weight value={item.value} />
                </div>
              ) : item.type === 'balloon' ? (
                <div
                  key={item.key}
                  className="removable-item"
                  onClick={() => handleRemoveFromLeft(item.index)}
                  title="Click to remove"
                >
                  <Balloon value={item.value} />
                </div>
              ) : item.type === 'unknown' ? (
                <div key={item.key} className="unknown-triangle">
                  <span>x</span>
                </div>
              ) : null
            ))}
            {leftItems.length === 0 && (
              <div className="empty-placeholder">Drop items here</div>
            )}
          </div>
        </div>

        <div className="fulcrum">
          <div className="beam" style={{
            transform: `rotate(${Math.max(-15, Math.min(15, balance * 5))}deg)`
          }} />
          <div className="pivot">△</div>
        </div>

        <div className="scale-side right-side">
          <div className="side-label">Right Side</div>
          <div
            className="items-container"
            onDrop={handleDropRight}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {rightItems.map((item) => (
              item.type === 'weight' ? (
                <div
                  key={item.key}
                  className="removable-item"
                  onClick={() => handleRemoveFromRight(item.index)}
                  title="Click to remove"
                >
                  <Weight value={item.value} />
                </div>
              ) : item.type === 'balloon' ? (
                <div
                  key={item.key}
                  className="removable-item"
                  onClick={() => handleRemoveFromRight(item.index)}
                  title="Click to remove"
                >
                  <Balloon value={item.value} />
                </div>
              ) : item.type === 'unknown' ? (
                <div key={item.key} className="unknown-triangle">
                  <span>x</span>
                </div>
              ) : null
            ))}
            {rightItems.length === 0 && (
              <div className="empty-placeholder">Drop items here</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scale
