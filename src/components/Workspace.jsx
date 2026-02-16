import Scale from './Scale'
import StorageArea from './StorageArea'
import './Workspace.css'

function Workspace({
  equationState,
  setEquationState,
  solution,
  storage,
  takeFromStorage,
  returnToStorage
}) {
  return (
    <div className="workspace">
      <Scale
        leftSide={equationState.leftSide}
        rightSide={equationState.rightSide}
        setEquationState={setEquationState}
        solution={solution}
        returnToStorage={returnToStorage}
        takeFromStorage={takeFromStorage}
      />
      <StorageArea
        storage={storage}
        takeFromStorage={takeFromStorage}
        setEquationState={setEquationState}
        equationState={equationState}
        returnToStorage={returnToStorage}
      />
    </div>
  )
}

export default Workspace
