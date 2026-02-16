import { useState } from 'react'
import Workspace from './components/Workspace'
import EquationDisplay from './components/EquationDisplay'
import { getDefaultEquation, equations } from './data/equations'
import './App.css'

function App() {
  const [activeEquation, setActiveEquation] = useState(getDefaultEquation())
  const [equationState, setEquationState] = useState({
    leftSide: activeEquation.leftSide,
    rightSide: activeEquation.rightSide,
  })

  const handleEquationChange = (equationId) => {
    const newEquation = equations.find(eq => eq.id === equationId)
    if (newEquation) {
      setActiveEquation(newEquation)
      setEquationState({
        leftSide: newEquation.leftSide,
        rightSide: newEquation.rightSide,
      })
    }
  }

  const handleReset = () => {
    setEquationState({
      leftSide: activeEquation.leftSide,
      rightSide: activeEquation.rightSide,
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
        />
      </main>

      <footer>
        <p>Visualize equations as balanced scales</p>
      </footer>
    </div>
  )
}

export default App
