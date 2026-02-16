import { calculateBalance } from '../utils/balanceLogic'
import Weight from './Weight'
import Balloon from './Balloon'
import './Scale.css'

function Scale({ leftSide, rightSide, setEquationState, solution, returnToStorage, takeFromStorage }) {
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

  // Handle drag start from scale item (to return to storage)
  const handleScaleItemDragStart = (e, itemType, side) => {
    e.stopPropagation()
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('itemType', itemType)
    e.dataTransfer.setData('itemValue', itemType === 'weight' ? '1' : '-1')
    e.dataTransfer.setData('fromStorage', 'false') // Mark as from scales
    e.dataTransfer.setData('fromSide', side) // Track which side (left or right)
  }

  const handleScaleItemDragEnd = (e) => {
    // Visual feedback can be added here if needed
  }

  // Handle drop on left side
  const handleDropLeft = (e) => {
    e.preventDefault()
    const itemType = e.dataTransfer.getData('itemType')
    const itemValue = parseInt(e.dataTransfer.getData('itemValue'), 10)
    const fromStorage = e.dataTransfer.getData('fromStorage')

    // Only add items that come from storage, not from scales
    if (fromStorage === 'true') {
      const newItem = {
        type: itemType,
        value: itemValue
      }

      // Remove from storage
      if (takeFromStorage) {
        takeFromStorage(itemType)
      }

      // Add to scales
      setEquationState(prev => ({
        ...prev,
        leftSide: [...prev.leftSide, newItem]
      }))
    }

    e.currentTarget.classList.remove('drag-over')
  }

  // Handle drop on right side
  const handleDropRight = (e) => {
    e.preventDefault()
    const itemType = e.dataTransfer.getData('itemType')
    const itemValue = parseInt(e.dataTransfer.getData('itemValue'), 10)
    const fromStorage = e.dataTransfer.getData('fromStorage')

    // Only add items that come from storage, not from scales
    if (fromStorage === 'true') {
      const newItem = {
        type: itemType,
        value: itemValue
      }

      // Remove from storage
      if (takeFromStorage) {
        takeFromStorage(itemType)
      }

      // Add to scales
      setEquationState(prev => ({
        ...prev,
        rightSide: [...prev.rightSide, newItem]
      }))
    }

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
        Click items to remove, or drag them back to empty storage slots
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
                  draggable={true}
                  onDragStart={(e) => handleScaleItemDragStart(e, item.type, 'left')}
                  onDragEnd={handleScaleItemDragEnd}
                  onClick={() => handleRemoveFromLeft(item.index)}
                  title="Click to remove or drag back to storage"
                >
                  <Weight value={item.value} />
                </div>
              ) : item.type === 'balloon' ? (
                <div
                  key={item.key}
                  className="removable-item"
                  draggable={true}
                  onDragStart={(e) => handleScaleItemDragStart(e, item.type, 'left')}
                  onDragEnd={handleScaleItemDragEnd}
                  onClick={() => handleRemoveFromLeft(item.index)}
                  title="Click to remove or drag back to storage"
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
                  draggable={true}
                  onDragStart={(e) => handleScaleItemDragStart(e, item.type, 'right')}
                  onDragEnd={handleScaleItemDragEnd}
                  onClick={() => handleRemoveFromRight(item.index)}
                  title="Click to remove or drag back to storage"
                >
                  <Weight value={item.value} />
                </div>
              ) : item.type === 'balloon' ? (
                <div
                  key={item.key}
                  className="removable-item"
                  draggable={true}
                  onDragStart={(e) => handleScaleItemDragStart(e, item.type, 'right')}
                  onDragEnd={handleScaleItemDragEnd}
                  onClick={() => handleRemoveFromRight(item.index)}
                  title="Click to remove or drag back to storage"
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
