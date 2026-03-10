import Scale from './Scale'
import ControlPanel from './ControlPanel'
import './Workspace.css'

function Workspace({
  equationState,
  setEquationState,
  solution,
  pendingRemoval,
  onRemoveItem,
  onCancelPendingRemoval,
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
      />
      <ControlPanel
        setEquationState={setEquationState}
        isLocked={Boolean(pendingRemoval)}
      />
    </div>
  )
}

export default Workspace
