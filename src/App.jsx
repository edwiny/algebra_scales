import { useState, useEffect } from 'react'
import Workspace from './components/Workspace'
import EquationDisplay from './components/EquationDisplay'
import VictoryModal from './components/VictoryModal'
import { getDefaultEquation, equations } from './data/equations'
import { checkVictoryCondition } from './utils/balanceLogic'
import './App.css'

function App() {
  const [activeEquation, setActiveEquation] = useState(getDefaultEquation())
  const [equationState, setEquationState] = useState({
    leftSide: [],
    rightSide: [],
  })

  // Victory state
  const [isVictory, setIsVictory] = useState(false)

  // Loading state
  const [isLoading, setIsLoading] = useState(true)

  // Initialize equation
  const initializeEquation = (equation) => {
    // Reset victory state
    setIsVictory(false)

    setEquationState({
      leftSide: equation.leftSide,
      rightSide: equation.rightSide,
    })
  }

  // Initialize on mount
  useEffect(() => {
    initializeEquation(activeEquation)
    // Simulate loading time for better UX
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  // Check for victory condition whenever equation state changes
  useEffect(() => {
    const victory = checkVictoryCondition(
      equationState.leftSide,
      equationState.rightSide,
      activeEquation.solution
    )
    setIsVictory(victory)
  }, [equationState, activeEquation.solution])

  const handleEquationChange = (equationId) => {
    const newEquation = equations.find(eq => eq.id === equationId)
    if (newEquation) {
      setActiveEquation(newEquation)
      initializeEquation(newEquation)
    }
  }

  const handleReset = () => {
    initializeEquation(activeEquation)
  }

  const handleNextEquation = () => {
    const currentIndex = equations.findIndex(eq => eq.id === activeEquation.id)
    if (currentIndex < equations.length - 1) {
      const nextEquation = equations[currentIndex + 1]
      setActiveEquation(nextEquation)
      initializeEquation(nextEquation)
    }
  }

  const handleCloseVictory = () => {
    setIsVictory(false)
  }



  return (
    <div className="App">
      <header>
        <h1>Algebra Scales</h1>
        <p>Learn algebra through visual balance</p>
      </header>

      <main>
        <div className="equation-selector">
          <label htmlFor="equation-select">Choose an equation: </label>
          <select
            id="equation-select"
            value={activeEquation.id}
            onChange={(e) => handleEquationChange(Number(e.target.value))}
            aria-describedby="equation-description"
            disabled={isLoading}
          >
            {equations.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name} - {eq.description}
              </option>
            ))}
          </select>
          <div id="equation-description" className="sr-only">
            Select an algebraic equation to practice balancing scales with weights and balloons
          </div>
        </div>

        <EquationDisplay equationState={equationState} />
        <Workspace
          equationState={equationState}
          setEquationState={setEquationState}
          solution={activeEquation.solution}
        />

        <div className="reset-section">
          <button
            onClick={handleReset}
            className="reset-button"
            aria-label="Reset the current equation to its initial state"
            disabled={isLoading}
          >
            Reset Equation
          </button>
        </div>
      </main>

      <footer>
        <p>Visualize equations as balanced scales</p>
      </footer>

      {isLoading && (
        <div className="loading-overlay" aria-live="polite" aria-label="Loading algebra scales application">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p>Loading scales...</p>
        </div>
      )}

      <VictoryModal
        isVisible={isVictory}
        solution={activeEquation.solution}
        onNextEquation={handleNextEquation}
        onReset={handleReset}
        onClose={handleCloseVictory}
        hasNextEquation={
          equations.findIndex(eq => eq.id === activeEquation.id) < equations.length - 1
        }
      />
    </div>
  )
}

export default App
