/**
 * Predefined equations for students to practice with
 * Each equation includes the problem state and the solution
 */

export const equations = [
  {
    id: 1,
    name: "Simple Addition",
    description: "Solve for x in a basic addition equation",
    leftSide: [
      { type: 'unknown', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
    ],
    rightSide: [
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
    ],
    solution: 2, // x + 3 = 5, so x = 2
  },
  {
    id: 2,
    name: "Simple Subtraction",
    description: "Solve for x with subtraction",
    leftSide: [
      { type: 'unknown', value: 1 },
      { type: 'balloon', value: -1 },
      { type: 'balloon', value: -1 },
    ],
    rightSide: [
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
    ],
    solution: 5, // x - 2 = 3, so x = 5
  },
  {
    id: 3,
    name: "Larger Numbers",
    description: "Work with bigger values",
    leftSide: [
      { type: 'unknown', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
    ],
    rightSide: [
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
    ],
    solution: 5, // x + 7 = 12, so x = 5
  },
  {
    id: 4,
    name: "Negative Result",
    description: "Unknown on the right side",
    leftSide: [
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
    ],
    rightSide: [
      { type: 'unknown', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
    ],
    solution: -2, // 4 = x + 6, so x = -2
  },
  {
    id: 5,
    name: "With Negatives",
    description: "Equation with balloons",
    leftSide: [
      { type: 'unknown', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      
    ],
    rightSide: [
      { type: 'balloon', value: -1 },
      { type: 'balloon', value: -1 },
      { type: 'balloon', value: -1 },
    ],
    solution: -5, 
  },
  {
    id: 6,
    name: "Addition with Negative",
    description: "Adding a negative number",
    leftSide: [
      { type: 'unknown', value: 1 },
      { type: 'balloon', value: -1 },
      { type: 'balloon', value: -1 },
    ],
    rightSide: [
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
    ],
    solution: 5, // x + (-2) = 3, so x = 5
  },
]

/**
 * Get equation by ID
 * @param {number} id - Equation ID
 * @returns {Object|null} Equation object or null if not found
 */
export function getEquationById(id) {
  return equations.find(eq => eq.id === id) || null
}

/**
 * Get the first equation (default starting equation)
 * @returns {Object} First equation
 */
export function getDefaultEquation() {
  return equations[0]
}
