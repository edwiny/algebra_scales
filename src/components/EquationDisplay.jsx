import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { calculateBalance } from '../utils/balanceLogic'
import LeftTerm from './LeftTerm'
import RightTerm from './RightTerm'
import Comparator from './Comparator'
import './EquationTerm.css'

function EquationDisplay({ equationState, solution = null, isSolved = false, onNextEquation = null, hasNextEquation = false }) {
  const balance = calculateBalance(equationState.leftSide, equationState.rightSide, solution)
  const comparisonOperator = balance === 0 ? '=' : balance > 0 ? '<' : '>'
  const tickRef = useRef(null)
  const prevIsSolvedRef = useRef(false)

  // Trigger confetti from the tick mark position when equation transitions to solved
  useEffect(() => {
    // Detect transition from false to true (equation just got solved)
    if (isSolved && !prevIsSolvedRef.current && tickRef.current) {
      const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!prefersReducedMotion) {
        const rect = tickRef.current.getBoundingClientRect()
        const x = rect.left / window.innerWidth
        const y = rect.top / window.innerHeight

        confetti({
          particleCount: 80,
          spread: 70,
          startVelocity: 30,
          origin: { x, y },
          colors: ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B']
        })
      }
    }
    
    // Update previous value for next render
    prevIsSolvedRef.current = isSolved
  }, [isSolved])

  return (
    <section className={`equation-display ${isSolved ? 'equation-solved' : ''}`} aria-label="Current algebra equation">
      <div className="equation-header">
        <div className="equation-label">Current equation</div>
        {isSolved && (
          <div className="equation-solved-feedback">
            <div className="solved-tick" ref={tickRef} aria-hidden="true">
              ✓
            </div>
            {hasNextEquation && onNextEquation && (
              <button 
                className="next-equation-btn"
                onClick={onNextEquation}
                aria-label="Move to the next equation"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
      <div className="equation-content">
        <LeftTerm items={equationState.leftSide} />
        <Comparator operator={comparisonOperator} />
        <RightTerm items={equationState.rightSide} />
      </div>
    </section>
  )
}

export default EquationDisplay
