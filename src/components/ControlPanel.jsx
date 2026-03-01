import Weight from './Weight'
import Balloon from './Balloon'
import './ControlPanel.css'

function ControlPanel({ setEquationState }) {
  const addItemToSide = (itemType, side) => {
    const newItem = {
      type: itemType,
      value: itemType === 'weight' ? 1 : -1
    }

    setEquationState(prev => ({
      ...prev,
      [side]: [...prev[side], newItem]
    }))
  }

  return (
    <div className="control-panel">
      <h3 className="control-title">Add Items to Scales</h3>
      <div className="control-grid">
        {/* Weight row */}
        <div className="control-row">
          <button
            className="control-button left-arrow"
            onClick={() => addItemToSide('weight', 'leftSide')}
            aria-label="Add weight to left side"
          >
            ←
          </button>
          <div className="item-display">
            <Weight />
            <span className="item-label">Weight</span>
          </div>
          <button
            className="control-button right-arrow"
            onClick={() => addItemToSide('weight', 'rightSide')}
            aria-label="Add weight to right side"
          >
            →
          </button>
        </div>

        {/* Balloon row */}
        <div className="control-row">
          <button
            className="control-button left-arrow"
            onClick={() => addItemToSide('balloon', 'leftSide')}
            aria-label="Add balloon to left side"
          >
            ←
          </button>
          <div className="item-display">
            <Balloon />
            <span className="item-label">Balloon</span>
          </div>
          <button
            className="control-button right-arrow"
            onClick={() => addItemToSide('balloon', 'rightSide')}
            aria-label="Add balloon to right side"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel