import Weight from './Weight'
import Balloon from './Balloon'
import './StorageArea.css'

function StorageArea() {
  // Create arrays for 10 weights and 10 balloons
  const weights = Array(10).fill(null).map((_, index) => index)
  const balloons = Array(10).fill(null).map((_, index) => index)

  const handleDragStart = (e) => {
    e.currentTarget.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
  }

  return (
    <div className="storage-area">
      <h3 className="storage-title">Available Items</h3>
      <p className="storage-instruction">Drag items to the scale sides to add them to the equation</p>

      <div className="storage-sections">
        <div className="storage-section">
          <div className="section-label">Weights (1g each)</div>
          <div className="items-grid">
            {weights.map((_, index) => (
              <Weight
                key={`storage-weight-${index}`}
                value={1}
                draggable={true}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </div>

        <div className="storage-section">
          <div className="section-label">Balloons (-1 lift each)</div>
          <div className="items-grid">
            {balloons.map((_, index) => (
              <Balloon
                key={`storage-balloon-${index}`}
                value={-1}
                draggable={true}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StorageArea
