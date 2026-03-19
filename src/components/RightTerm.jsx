import { sideToExpression } from '../utils/algebraParser'
import './EquationTerm.css'

function RightTerm({ items }) {
  const expression = sideToExpression(items)

  return (
    <div className="equation-term right-term">
      <span className="term-label">Right</span>
      <div className="term-content">
        <span className="term-expression">{expression}</span>
      </div>
    </div>
  )
}

export default RightTerm
