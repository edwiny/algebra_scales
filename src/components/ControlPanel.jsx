import Weight from './Weight'
import Balloon from './Balloon'
import './ControlPanel.css'

function ControlPanel({ setEquationState }) {
  const addItemToSide = (itemType, side) => {
    const newItem = {
      type: itemType,
      value: itemType === 'weight' ? 1 : -1
    }

    setEquationState((prev) => ({
      ...prev,
      [side]: [...prev[side], newItem]
    }))
  }

  const controls = [
    {
      key: 'weight',
      title: 'Add a weight',
      description: 'Weights push down.',
      preview: <Weight />,
    },
    {
      key: 'balloon',
      title: 'Add a balloon',
      description: 'Balloons pull upwards.',
      preview: <Balloon />,
    },
  ]

  return (
    <aside className="control-panel" aria-label="Add items to the scale">
      <div className="control-panel-header">
        <h3 className="control-title">Build both sides</h3>
        <p className="control-subtitle">Choose what to add, then send it left or right.</p>
      </div>

      <div className="control-grid">
        {controls.map((control) => (
          <section key={control.key} className="control-card">
            <div className="item-display">
              {control.preview}
              <div className="item-copy">
                <span className="item-title">{control.title}</span>
                <span className="item-label">{control.description}</span>
              </div>
            </div>

            <div className="control-actions">
              <button
                type="button"
                className="control-button"
                onClick={() => addItemToSide(control.key, 'leftSide')}
                aria-label={`Add ${control.key} to left side`}
              >
                Add to left
              </button>
              <button
                type="button"
                className="control-button control-button-alt"
                onClick={() => addItemToSide(control.key, 'rightSide')}
                aria-label={`Add ${control.key} to right side`}
              >
                Add to right
              </button>
            </div>
          </section>
        ))}
      </div>
    </aside>
  )
}

export default ControlPanel
