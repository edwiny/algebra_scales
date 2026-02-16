import Scale from './Scale'
import StorageArea from './StorageArea'
import './Workspace.css'

function Workspace({ equationState, setEquationState, solution }) {
  return (
    <div className="workspace">
      <Scale
        leftSide={equationState.leftSide}
        rightSide={equationState.rightSide}
        setEquationState={setEquationState}
        solution={solution}
      />
      <StorageArea />
    </div>
  )
}

export default Workspace
