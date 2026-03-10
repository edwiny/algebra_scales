import './Balloon.css'

function Balloon({ value = -1, draggable = false, onDragStart, onDragEnd, id }) {
  const handleDragStart = (e) => {
    if (draggable && onDragStart) {
      e.dataTransfer.effectAllowed = 'copy'
      e.dataTransfer.setData('itemType', 'balloon')
      e.dataTransfer.setData('itemValue', value)
      onDragStart && onDragStart(e)
    }
  }

  const handleDragEnd = (e) => {
    onDragEnd && onDragEnd(e)
  }

  return (
    <div
      className={`balloon ${draggable ? 'draggable' : ''}`}
      title="Balloon: -1 lift"
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="balloon-body">
        <span className="balloon-value">-1</span>
      </div>
      <div className="balloon-string" />
    </div>
  )
}

export default Balloon

