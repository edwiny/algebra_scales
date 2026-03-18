/**
 * Pure functions for balance calculations
 */

/**
 * Calculate the total value of items on one side
 * @param {Array} items - Array of items with type and value
 * @returns {number} Total value
 */
export function calculateSideValue(items) {
  return items.reduce((total, item) => {
    if (item.type === 'weight') {
      return total + item.value
    } else if (item.type === 'balloon') {
      return total + item.value // Already negative
    } else if (item.type === 'unknown') {
      return total // Can't calculate unknown yet
    }
    return total
  }, 0)
}

/**
 * Calculate the balance between two sides
 * Positive means right side is heavier, negative means left side is heavier
 * Uses the provided solution for x to determine balance
 * @param {Array} leftSide - Items on left side
 * @param {Array} rightSide - Items on right side
 * @param {number} solution - The value of x for this equation
 * @returns {number} Balance value
 */
export function calculateBalance(leftSide, rightSide, solution = null) {
  // Use provided solution if available, otherwise try to calculate
  const xValue = solution !== null ? solution : solveForX(leftSide, rightSide)

  if (xValue !== null) {
    // Substitute x value in the calculation
    const leftUnknowns = countItemsByType(leftSide, 'unknown')
    const rightUnknowns = countItemsByType(rightSide, 'unknown')

    const leftValue = calculateSideValue(leftSide) + (leftUnknowns * xValue)
    const rightValue = calculateSideValue(rightSide) + (rightUnknowns * xValue)
    return rightValue - leftValue
  } else {
    // If we can't solve for x, calculate without it
    const leftValue = calculateSideValue(leftSide)
    const rightValue = calculateSideValue(rightSide)
    return rightValue - leftValue
  }
}

/**
 * Check if the scale is balanced
 * @param {Array} leftSide - Items on left side
 * @param {Array} rightSide - Items on right side
 * @returns {boolean} True if balanced
 */
export function isBalanced(leftSide, rightSide) {
  return calculateBalance(leftSide, rightSide) === 0
}

/**
 * Count items of a specific type on one side
 * @param {Array} items - Array of items
 * @param {string} type - Type to count ('weight', 'balloon', 'unknown')
 * @returns {number} Count of items
 */
export function countItemsByType(items, type) {
  return items.filter(item => item.type === type).length
}

/**
 * Solve for x when x is isolated on one side
 * @param {Array} leftSide - Items on left side
 * @param {Array} rightSide - Items on right side
 * @returns {number|null} Value of x, or null if can't solve
 */
export function solveForX(leftSide, rightSide) {
  const leftUnknowns = countItemsByType(leftSide, 'unknown')
  const rightUnknowns = countItemsByType(rightSide, 'unknown')

  // Can only solve if x is on one side only
  if (leftUnknowns === 1 && rightUnknowns === 0) {
    return calculateSideValue(rightSide) - calculateSideValue(leftSide.filter(item => item.type !== 'unknown'))
  } else if (rightUnknowns === 1 && leftUnknowns === 0) {
    return calculateSideValue(leftSide) - calculateSideValue(rightSide.filter(item => item.type !== 'unknown'))
  }

  return null // Can't solve yet
}

/**
 * Check if the equation has been solved correctly (victory condition)
 * Victory conditions:
 * 1. x is isolated on one side (only unknown items on that side)
 * 2. The other side's value matches the expected solution
 * 3. The scales are balanced
 *
 * @param {Array} leftSide - Items on left side
 * @param {Array} rightSide - Items on right side
 * @param {number} expectedSolution - The correct value of x
 * @returns {boolean} True if equation is solved correctly
 */
export function checkVictoryCondition(leftSide, rightSide, expectedSolution) {
  const leftUnknowns = countItemsByType(leftSide, 'unknown')
  const rightUnknowns = countItemsByType(rightSide, 'unknown')

  // Check if x is isolated on exactly one side
  const isIsolatedOnLeft = leftUnknowns >= 1 && rightUnknowns === 0 &&
                           leftSide.length === leftUnknowns
  const isIsolatedOnRight = rightUnknowns >= 1 && leftUnknowns === 0 &&
                            rightSide.length === rightUnknowns

  if (!isIsolatedOnLeft && !isIsolatedOnRight) {
    return false // x is not isolated
  }

  // Calculate the value of x
  const calculatedX = solveForX(leftSide, rightSide)

  if (calculatedX === null) {
    return false // Can't solve
  }

  // Check if calculated value matches expected solution
  return calculatedX === expectedSolution
}

/**
 * Check if division can be performed on the equation without resulting in fractions
 * Division is valid when:
 * 1. There's more than one unknown (x coefficient > 1) on one side
 * 2. The other side can be evenly divided by the coefficient
 * 3. There are no balloons (negative values complicate the visual model)
 * 4. The side with unknowns has ONLY unknowns (no mixed weights/balloons)
 *    This ensures x is "ready" for division - no additional terms on x's side
 * 
 * @param {Array} leftSide - Items on left side
 * @param {Array} rightSide - Items on right side
 * @returns {Object|null} Object with division info if valid, null otherwise
 */
export function canDivideBy(leftSide, rightSide) {
  const leftUnknowns = countItemsByType(leftSide, 'unknown')
  const rightUnknowns = countItemsByType(rightSide, 'unknown')
  const leftWeights = countItemsByType(leftSide, 'weight')
  const rightWeights = countItemsByType(rightSide, 'weight')
  const leftBalloons = countItemsByType(leftSide, 'balloon')
  const rightBalloons = countItemsByType(rightSide, 'balloon')

  // Need exactly one side to have unknowns for division to make sense
  // (the coefficient we're dividing by)
  if (leftUnknowns > 1 && rightUnknowns === 0) {
    // Division by leftUnknowns: 
    // - Left side must have ONLY unknowns (no weights or balloons mixed with x)
    // - Right side must have only weights/balloons (no unknowns)
    if (leftWeights === 0 && leftBalloons === 0 && rightUnknowns === 0) {
      const divisor = leftUnknowns
      const rightSideValue = calculateSideValue(rightSide)
      
      // Check if right side can be evenly divided
      if (rightSideValue % divisor === 0 && rightSideValue !== 0) {
        // Also check there's no balloons on either side
        if (leftBalloons === 0 && rightBalloons === 0) {
          return {
            divisor,
            sideWithUnknowns: 'leftSide',
            sideWithValue: 'rightSide',
            originalRightValue: rightSideValue,
            newRightValue: rightSideValue / divisor,
          }
        }
      }
    }
  } else if (rightUnknowns > 1 && leftUnknowns === 0) {
    // Division by rightUnknowns:
    // - Right side must have ONLY unknowns (no weights or balloons mixed with x)
    // - Left side must have only weights/balloons (no unknowns)
    if (rightWeights === 0 && rightBalloons === 0 && leftUnknowns === 0) {
      const divisor = rightUnknowns
      const leftSideValue = calculateSideValue(leftSide)
      
      // Check if left side can be evenly divided
      if (leftSideValue % divisor === 0 && leftSideValue !== 0) {
        // Also check there's no balloons on either side
        if (leftBalloons === 0 && rightBalloons === 0) {
          return {
            divisor,
            sideWithUnknowns: 'rightSide',
            sideWithValue: 'leftSide',
            originalLeftValue: leftSideValue,
            newLeftValue: leftSideValue / divisor,
          }
        }
      }
    }
  }

  return null
}
