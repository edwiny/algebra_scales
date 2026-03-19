import Scale from './Scale'
import ControlPanel from './ControlPanel'
import EquationDisplay from './EquationDisplay'
import './Workspace.css'

function Workspace({
  equationState,
  setEquationState,
  solution,
  pendingRemoval,
  onRemoveItem,
  onCancelPendingRemoval,
  divideOperation,
  onDivide,
  isVictory,
  onNextEquation,
  hasNextEquation,
  currentEquationIndex,
  equations,
}) {
  return (
    <div className="workspace">
      <Scale
        leftSide={equationState.leftSide}
        rightSide={equationState.rightSide}
        pendingRemoval={pendingRemoval}
        onRemoveItem={onRemoveItem}
        onCancelPendingRemoval={onCancelPendingRemoval}
        solution={solution}
        divideOperation={divideOperation}
        onDivide={onDivide}
      />
      
      <EquationDisplay 
        equationState={equationState} 
        solution={solution}
        isSolved={isVictory}
        onNextEquation={onNextEquation}
        hasNextEquation={hasNextEquation}
      />

      <ControlPanel
        setEquationState={setEquationState}
        isLocked={Boolean(pendingRemoval)}
      />
    </div>
  )
}

export default Workspace
