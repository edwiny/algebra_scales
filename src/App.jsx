import { useState, useEffect } from 'react'
import Workspace from './components/Workspace'
import EquationDisplay from './components/EquationDisplay'
import VictoryModal from './components/VictoryModal'
import { getDefaultEquation, equations } from './data/equations'
import { checkVictoryCondition } from './utils/balanceLogic'
import { stateToEquation } from './utils/algebraParser'
import './App.css'

function App() {
  const [activeEquation, setActiveEquation] = useState(getDefaultEquation())
  const [equationState, setEquationState] = useState({
    leftSide: [],
    rightSide: [],
  })
  const [isVictory, setIsVictory] = useState(false)
  const [pendingRemoval, setPendingRemoval] = useState(null)

  const initializeEquation = (equation) => {
    setIsVictory(false)
    setPendingRemoval(null)

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

  const handleRemoveItem = (side, index, item) => {
    const otherSide = side === 'leftSide' ? 'rightSide' : 'leftSide'
    const hasMatchingItem = equationState[otherSide].some(
      (candidate) => candidate.type === item.type
    )

    setEquationState((prev) => ({
      ...prev,
      [side]: prev[side].filter((_, itemIndex) => itemIndex !== index),
    }))

    if (pendingRemoval) {
      const isMatchingSide = side !== pendingRemoval.fromSide
      const isMatchingType = item.type === pendingRemoval.type

      if (isMatchingSide && isMatchingType) {
        setPendingRemoval(null)
      }

      return
    }

    if (hasMatchingItem) {
      setPendingRemoval({
        type: item.type,
        fromSide: side,
        item,
        index,
      })
    }
  }

  const handleCancelPendingRemoval = () => {
    if (!pendingRemoval) return

    setEquationState((prev) => {
      const updatedSide = [...prev[pendingRemoval.fromSide]]
      updatedSide.splice(pendingRemoval.index, 0, pendingRemoval.item)

      return {
        ...prev,
        [pendingRemoval.fromSide]: updatedSide,
      }
    })

    setPendingRemoval(null)
  }

  const handleCloseVictory = () => {
    setIsVictory(false)
  }

  const currentEquationIndex = equations.findIndex((eq) => eq.id === activeEquation.id)
  const currentStep = currentEquationIndex + 1
  const totalSteps = equations.length
  const originalEquation = stateToEquation({ leftSide: activeEquation.leftSide, rightSide: activeEquation.rightSide })

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

        <EquationDisplay equationState={equationState} solution={activeEquation.solution} />

        <Workspace
          equationState={equationState}
          setEquationState={setEquationState}
          pendingRemoval={pendingRemoval}
          onRemoveItem={handleRemoveItem}
          onCancelPendingRemoval={handleCancelPendingRemoval}
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
        originalEquation={originalEquation}
        onNextEquation={handleNextEquation}
        onReset={handleReset}
        onClose={handleCloseVictory}
        hasNextEquation={currentEquationIndex < equations.length - 1}
      />
    </div>
  )
}

export default App




