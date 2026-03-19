import { sideToExpression } from '../utils/algebraParser'
import './EquationTerm.css'

function LeftTerm({ items }) {
  const expression = sideToExpression(items)

  return (
    <div className="equation-term left-term">
      <span className="term-label">Left</span>
      <div className="term-content">
        <span className="term-expression">{expression}</span>
      </div>
    </div>
  )
}

export default LeftTerm
