import { useState, useEffect } from 'react'
import Workspace from './components/Workspace'
import EquationDisplay from './components/EquationDisplay'
import VictoryModal from './components/VictoryModal'
import { getDefaultEquation, equations } from './data/equations'
import { STORAGE_CONFIG } from './config/constants'
import { checkVictoryCondition } from './utils/balanceLogic'
import './App.css'

function App() {
  const [activeEquation, setActiveEquation] = useState(getDefaultEquation())
  const [equationState, setEquationState] = useState({
    leftSide: [],
    rightSide: [],
  })

  // Storage state: array of slots, each with filled status
  const [storage, setStorage] = useState({
    weights: Array(STORAGE_CONFIG.WEIGHTS_CAPACITY).fill(true),
    balloons: Array(STORAGE_CONFIG.BALLOONS_CAPACITY).fill(true),
  })

  // Victory state
  const [isVictory, setIsVictory] = useState(false)

  // Initialize equation and storage
  const initializeEquation = (equation) => {
    // Reset victory state
    setIsVictory(false)

    // Reset storage to full
    const newStorage = {
      weights: Array(STORAGE_CONFIG.WEIGHTS_CAPACITY).fill(true),
      balloons: Array(STORAGE_CONFIG.BALLOONS_CAPACITY).fill(true),
    }

    // Count items needed from equation
    const allItems = [...equation.leftSide, ...equation.rightSide]
    const weightsNeeded = allItems.filter(item => item.type === 'weight').length
    const balloonsNeeded = allItems.filter(item => item.type === 'balloon').length

    // Remove items from storage
    for (let i = 0; i < weightsNeeded && i < newStorage.weights.length; i++) {
      newStorage.weights[i] = false
    }
    for (let i = 0; i < balloonsNeeded && i < newStorage.balloons.length; i++) {
      newStorage.balloons[i] = false
    }

    setStorage(newStorage)
    setEquationState({
      leftSide: equation.leftSide,
      rightSide: equation.rightSide,
    })
  }

  // Initialize on mount
  useEffect(() => {
    initializeEquation(activeEquation)
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

  // Handle taking item from storage
  const takeFromStorage = (itemType) => {
    setStorage(prev => {
      const storageKey = itemType === 'weight' ? 'weights' : 'balloons'
      const newStorage = { ...prev }
      const firstFilledIndex = newStorage[storageKey].findIndex(slot => slot === true)

      if (firstFilledIndex !== -1) {
        newStorage[storageKey] = [...newStorage[storageKey]]
        newStorage[storageKey][firstFilledIndex] = false
      }

      return newStorage
    })
  }

  // Handle returning item to storage
  const returnToStorage = (itemType, slotIndex) => {
    setStorage(prev => {
      const storageKey = itemType === 'weight' ? 'weights' : 'balloons'
      const newStorage = { ...prev }
      newStorage[storageKey] = [...newStorage[storageKey]]
      newStorage[storageKey][slotIndex] = true
      return newStorage
    })
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
          >
            {equations.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name} - {eq.description}
              </option>
            ))}
          </select>
          <button onClick={handleReset} className="reset-button">
            Reset Equation
          </button>
        </div>

        <EquationDisplay equationState={equationState} />
        <Workspace
          equationState={equationState}
          setEquationState={setEquationState}
          solution={activeEquation.solution}
          storage={storage}
          takeFromStorage={takeFromStorage}
          returnToStorage={returnToStorage}
        />
      </main>

      <footer>
        <p>Visualize equations as balanced scales</p>
      </footer>

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
