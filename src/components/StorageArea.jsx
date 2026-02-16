import Weight from './Weight'
import Balloon from './Balloon'
import './StorageArea.css'

function StorageArea({ storage, takeFromStorage, setEquationState, returnToStorage }) {
  const handleDragStart = (e, itemType) => {
    e.currentTarget.style.opacity = '0.5'
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('itemType', itemType)
    e.dataTransfer.setData('itemValue', itemType === 'weight' ? '1' : '-1')
    e.dataTransfer.setData('fromStorage', 'true')
  }

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
  }

  // Handle drop on empty slot (return item from scale)
  const handleDropOnSlot = (e, itemType, slotIndex) => {
    e.preventDefault()
    e.stopPropagation()

    const draggedType = e.dataTransfer.getData('itemType')
    const fromStorage = e.dataTransfer.getData('fromStorage')
    const fromSide = e.dataTransfer.getData('fromSide') // 'left' or 'right'

    // Only allow returning items from scales (not from storage)
    if (fromStorage === 'true') return

    // Only allow returning if types match and slot is empty
    if (draggedType === itemType) {
      returnToStorage(itemType, slotIndex)

      // Remove one item of this type from scales
      setEquationState(prev => {
        const newState = { ...prev }

        // Remove from the side it came from
        if (fromSide === 'left') {
          const leftIndex = newState.leftSide.findIndex(item => item.type === itemType)
          if (leftIndex !== -1) {
            newState.leftSide = newState.leftSide.filter((_, index) => index !== leftIndex)
          }
        } else if (fromSide === 'right') {
          const rightIndex = newState.rightSide.findIndex(item => item.type === itemType)
          if (rightIndex !== -1) {
            newState.rightSide = newState.rightSide.filter((_, index) => index !== rightIndex)
          }
        }

        return newState
      })
    }

    e.currentTarget.classList.remove('drag-over')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over')
  }

  return (
    <div className="storage-area">
      <h3 className="storage-title">Storage Area</h3>
      <p className="storage-instruction">
        Drag items to scales. Drop items from scales back to empty slots.
      </p>

      <div className="storage-sections">
        <div className="storage-section">
          <div className="section-label">Weights (1g each)</div>
          <div className="items-grid">
            {storage.weights.map((isFilled, index) => (
              <div
                key={`weight-slot-${index}`}
                className={`storage-slot ${!isFilled ? 'empty' : ''}`}
                onDrop={(e) => handleDropOnSlot(e, 'weight', index)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {isFilled ? (
                  <div
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, 'weight')}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                      // Remove from storage and add to scales
                      takeFromStorage('weight')
                      setEquationState(prev => ({
                        ...prev,
                        leftSide: [...prev.leftSide, { type: 'weight', value: 1 }]
                      }))
                    }}
                  >
                    <Weight value={1} />
                  </div>
                ) : (
                  <div className="empty-slot-placeholder">
                    <span>1g</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="storage-section">
          <div className="section-label">Balloons (-1 lift each)</div>
          <div className="items-grid">
            {storage.balloons.map((isFilled, index) => (
              <div
                key={`balloon-slot-${index}`}
                className={`storage-slot ${!isFilled ? 'empty' : ''}`}
                onDrop={(e) => handleDropOnSlot(e, 'balloon', index)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {isFilled ? (
                  <div
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, 'balloon')}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                      // Remove from storage and add to scales
                      takeFromStorage('balloon')
                      setEquationState(prev => ({
                        ...prev,
                        leftSide: [...prev.leftSide, { type: 'balloon', value: -1 }]
                      }))
                    }}
                  >
                    <Balloon value={-1} />
                  </div>
                ) : (
                  <div className="empty-slot-placeholder">
                    <span>-1</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StorageArea
