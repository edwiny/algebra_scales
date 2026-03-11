import { stateToEquation } from '../utils/algebraParser'
import { calculateBalance } from '../utils/balanceLogic'
import './EquationDisplay.css'

function EquationDisplay({ equationState, solution = null }) {
  const balance = calculateBalance(equationState.leftSide, equationState.rightSide, solution)
  const comparisonOperator = balance === 0 ? '=' : balance > 0 ? '<' : '>'
  const equation = stateToEquation(equationState, comparisonOperator)

  return (
    <section className="equation-display" aria-label="Current algebra equation">
      <div className="equation-label">Current equation</div>
      <div className="equation-text">{equation || 'No equation yet'}</div>
    </section>
  )
}

export default EquationDisplay

