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
  const [isVictory, setIsVictory] = useState(false)

  const initializeEquation = (equation) => {
    setIsVictory(false)

    setEquationState({
      leftSide: equation.leftSide,
      rightSide: equation.rightSide,
    })
  }

  useEffect(() => {
    initializeEquation(activeEquation)
  }, [])

  useEffect(() => {
    const victory = checkVictoryCondition(
      equationState.leftSide,
      equationState.rightSide,
      activeEquation.solution
    )
    setIsVictory(victory)
  }, [equationState, activeEquation.solution])

  const handleReset = () => {
    initializeEquation(activeEquation)
  }

  const handleNextEquation = () => {
    const currentIndex = equations.findIndex((eq) => eq.id === activeEquation.id)
    if (currentIndex < equations.length - 1) {
      const nextEquation = equations[currentIndex + 1]
      setActiveEquation(nextEquation)
      initializeEquation(nextEquation)
    }
  }

  const handleCloseVictory = () => {
    setIsVictory(false)
  }

  const currentEquationIndex = equations.findIndex((eq) => eq.id === activeEquation.id)
  const currentStep = currentEquationIndex + 1
  const totalSteps = equations.length

  return (
    <div className="App">
      <header className="app-header">
        <div className="app-header-copy">
          <p className="eyebrow">Pocket algebra practice</p>
          <h1>Algebra Scales</h1>
          <p className="app-subtitle">
            Solve each equation by keeping both sides balanced.
          </p>
        </div>

        <div className="progress-card" aria-label={`Equation ${currentStep} of ${totalSteps}`}>
          <span className="progress-label">Equation</span>
          <strong>{currentStep} / {totalSteps}</strong>
          <span className="progress-name">{activeEquation.name}</span>
        </div>
      </header>

      <main className="app-main">
        <section className="intro-card" aria-label="How the algebra model works">
          <div className="intro-header">
            <span className="intro-label">Current challenge</span>
            <p className="intro-title">{activeEquation.name}</p>
            <p className="intro-subtitle">{activeEquation.description}</p>
          </div>

          <div className="legend-card">
            <span className="legend-title">Legend</span>
            <div className="legend-items">
              <span className="legend-pill legend-weight">Weight = +1</span>
              <span className="legend-pill legend-balloon">Balloon = -1</span>
              <span className="legend-pill legend-unknown">Triangle = x</span>
            </div>
          </div>

          <p className="micro-tip">
            Tip: remove matching items from both sides until x is by itself.
          </p>
        </section>

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
          >
            Start this one again
          </button>
        </div>
      </main>

      <footer className="app-footer">
        <p>Practice one step at a time and keep the balance steady.</p>
      </footer>

      <VictoryModal
        isVisible={isVictory}
        solution={activeEquation.solution}
        onNextEquation={handleNextEquation}
        onReset={handleReset}
        onClose={handleCloseVictory}
        hasNextEquation={currentEquationIndex < equations.length - 1}
      />
    </div>
  )
}

export default App
