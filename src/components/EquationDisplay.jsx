import { stateToEquation } from '../utils/algebraParser'
import './EquationDisplay.css'

function EquationDisplay({ equationState }) {
  const equation = stateToEquation(equationState)

  return (
    <section className="equation-display" aria-label="Current algebra equation">
      <div className="equation-label">Current equation</div>
      <div className="equation-text">{equation || 'No equation yet'}</div>
      <p className="equation-helper">Watch how the symbols change as you keep the scale balanced.</p>
    </section>
  )
}

export default EquationDisplay
