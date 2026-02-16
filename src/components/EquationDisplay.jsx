import { stateToEquation } from '../utils/algebraParser'
import './EquationDisplay.css'

function EquationDisplay({ equationState }) {
  const equation = stateToEquation(equationState)

  return (
    <div className="equation-display">
      <div className="equation-label">Algebraic Equation:</div>
      <div className="equation-text">
        {equation || 'No equation yet'}
      </div>
    </div>
  )
}

export default EquationDisplay
