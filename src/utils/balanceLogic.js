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
