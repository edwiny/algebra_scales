import './EquationTerm.css'

function Comparator({ operator }) {
  return (
    <div className="equation-comparator">
      <span className="term-label">Compare</span>
      <div className="comparator-content">
        <span className="comparator-operator">{operator}</span>
      </div>
    </div>
  )
}

export default Comparator
