import './Weight.css'

function Weight({ value = 1, draggable = false, onDragStart, onDragEnd, id }) {
  const handleDragStart = (e) => {
    if (draggable && onDragStart) {
      e.dataTransfer.effectAllowed = 'copy'
      e.dataTransfer.setData('itemType', 'weight')
      e.dataTransfer.setData('itemValue', value)
      onDragStart && onDragStart(e)
    }
  }

  const handleDragEnd = (e) => {
    onDragEnd && onDragEnd(e)
  }

  return (
    <div
      className={`weight ${draggable ? 'draggable' : ''}`}
      title="Weight: 1g"
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="weight-body">
        <span className="weight-value">1g</span>
      </div>
    </div>
  )
}

export default Weight
