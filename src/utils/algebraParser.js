/**
 * Convert visual state to algebraic equation and vice versa
 */

/**
 * Convert a side's items to algebraic expression
 * @param {Array} items - Items on one side
 * @returns {string} Algebraic expression
 */
function sideToExpression(items) {
  if (items.length === 0) return '0'

  // Aggregate items by type and sum their values
  let unknownCount = 0
  let weightSum = 0
  let balloonSum = 0

  items.forEach(item => {
    if (item.type === 'weight') {
      weightSum += item.value
    } else if (item.type === 'balloon') {
      balloonSum += Math.abs(item.value)
    } else if (item.type === 'unknown') {
      unknownCount += item.value
    }
  })

  const terms = []

  // Add unknown term if present
  if (unknownCount > 0) {
    terms.push({ value: unknownCount === 1 ? 'x' : `${unknownCount}x`, isNegative: false })
  }

  // Add weight sum if present
  if (weightSum > 0) {
    terms.push({ value: weightSum, isNegative: false })
  }

  // Add balloon sum if present (as negative)
  if (balloonSum > 0) {
    terms.push({ value: balloonSum, isNegative: true })
  }

  if (terms.length === 0) return '0'

  // Build expression with proper signs
  let expression = ''

  for (let i = 0; i < terms.length; i++) {
    const term = terms[i]

    if (i === 0) {
      // First term
      if (term.isNegative) {
        expression += `(-${term.value})`
      } else {
        expression += term.value
      }
    } else {
      // Subsequent terms
      if (term.isNegative) {
        expression += ` + (-${term.value})`
      } else {
        expression += ` + ${term.value}`
      }
    }
  }

  return expression
}

/**
 * Convert equation state to algebraic equation string
 * @param {Object} equationState - State with leftSide and rightSide arrays
 * @param {string} comparisonOperator - Comparison operator (=, <, >)
 * @returns {string} Equation string
 */
export function stateToEquation(equationState, comparisonOperator = '=') {
  const leftExpr = sideToExpression(equationState.leftSide)
  const rightExpr = sideToExpression(equationState.rightSide)

  if (leftExpr === '0' && rightExpr === '0') {
    return ''
  }

  const safeOperator = ['=', '<', '>'].includes(comparisonOperator) ? comparisonOperator : '='

  return `${leftExpr} ${safeOperator} ${rightExpr}`
}

/**
 * Parse a simple algebraic equation into state
 * Handles formats like:
 * - "x + 3 = 5"
 * - "x + (-2) = 5"
 * - "x - 2 = 5"
 * @param {string} equation - Equation string
 * @returns {Object} State object with leftSide and rightSide
 */
export function equationToState(equation) {
  const sides = equation.split('=').map(s => s.trim())

  if (sides.length !== 2) {
    throw new Error('Invalid equation format')
  }

  const parseTerms = (expr) => {
    const items = []

    // Remove all spaces for easier parsing
    expr = expr.replace(/\s+/g, '')

    // Pattern to match terms: optional sign, optional parentheses with number, or just number/x
    // Matches: +3, -2, +(-3), -(-2), x, +x, -x, +(-x), etc.
    const termPattern = /([+-]?)(?:\(([+-]?\d+|[+-]?x)\)|([+-]?\d+|[+-]?x))/g

    let match
    let isFirstTerm = true

    while ((match = termPattern.exec(expr)) !== null) {
      const outerSign = match[1] // The sign before the term (+ or -)
      const parenContent = match[2] // Content inside parentheses
      const directValue = match[3] // Direct value without parentheses

      // Determine the actual value and sign
      let valueStr = parenContent || directValue

      // Determine if this term is negative
      let isNegative = false

      if (isFirstTerm && !outerSign) {
        // First term with no sign: check the value itself
        isNegative = valueStr.startsWith('-')
      } else if (outerSign === '-') {
        // Outer minus sign
        if (valueStr.startsWith('-')) {
          // Minus and minus = positive
          isNegative = false
        } else {
          // Just minus = negative
          isNegative = true
        }
      } else {
        // Plus sign or no sign (implicit plus for non-first terms)
        isNegative = valueStr.startsWith('-')
      }

      // Remove any leading sign from valueStr
      valueStr = valueStr.replace(/^[+-]/, '')

      // Parse the value
      if (valueStr === 'x' || valueStr === '') {
        items.push({ type: 'unknown', value: 1 })
      } else {
        const numValue = parseInt(valueStr, 10)
        if (!isNaN(numValue)) {
          if (isNegative) {
            items.push({ type: 'balloon', value: -numValue })
          } else {
            items.push({ type: 'weight', value: numValue })
          }
        }
      }

      isFirstTerm = false
    }

    return items
  }

  return {
    leftSide: parseTerms(sides[0]),
    rightSide: parseTerms(sides[1]),
  }
}

