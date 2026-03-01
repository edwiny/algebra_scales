import Scale from './Scale'
import ControlPanel from './ControlPanel'
import './Workspace.css'

function Workspace({
  equationState,
  setEquationState,
  solution
}) {
  return (
    <div className="workspace">
      <Scale
        leftSide={equationState.leftSide}
        rightSide={equationState.rightSide}
        setEquationState={setEquationState}
        solution={solution}
      />
      <ControlPanel
        setEquationState={setEquationState}
      />
    </div>
  )
}

export default Workspace
