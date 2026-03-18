/**
 * Predefined equations for students to practice with
 * Each equation includes the problem state and the solution
 */

export const equations = [
  {
    id: 1,
    name: "x represents an unknown weight on one side of the scales.",
    description: "Adding weights to the other side will reveal how much it weighs.",
    leftSide: [
      { type: 'unknown', value: 1 },
      
    ],
    rightSide: [
      
    ],
    solution: 2,
  },
  {
    id: 2,
    name: "When the scales are balanced, and x is all by itself on the one side, we know its value is the same as the other side.",
    description: "It does not matter which side of the scales x is.",
    leftSide: [
      
    ],
    rightSide: [
      { type: 'unknown', value: 1 },
    ],
    solution: 2,
  },
  {
    id: 3,
    name: "Sometimes another weight share the same side of the scales as x.",
    description: "When the scales are balanced, we know that 'x and one weight' weighs the same as the opposite side of the scales. All we have to do is to remove one weight from BOTH sides of the scales to keep it balanced and get x all by itself again.",
    leftSide: [
      { type: 'unknown', value: 1 },
      { type: 'weight', value: 1 },
    ],
    rightSide: [
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
    ],
    solution: 2,
  },
  {
    id: 4,
    name: "x can have different values, depending on the equation.",
    description: "x is really just a placeholder for an unknown number",
    leftSide: [
      { type: 'unknown', value: 1 },
    ],
    rightSide: [
    ],
    solution: 5,
  },
  {
    id: 5,
    name: "x can even be negative. If weights push down on a side of the scales, what do you think helium filled party balloons might do?",
    description: "Tip: try adding balloons to the opposite side. They have the opposite effect to weights, so we can think of them as negative numbers.",
    leftSide: [
      { type: 'unknown', value: 1 },
    ],
    rightSide: [
    ],
    solution: -2, 
  },
  {
    id: 6,
    name: "Lets mix some positive and negative numbers.",
    description: "Remember: to keep the scales balanced, whatever changes you make on one side of the scale, you have to repeat on the opposite side. Also remember:  '+ (-1)' is the same as '-1'",
    leftSide: [
      { type: 'unknown', value: 1 },
      { type: 'balloon', value: -1 },
      { type: 'weight', value: 1 },
      
    ],
    rightSide: [
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'balloon', value: -1 },
    ],
    solution: 2,
  },
  {
    id: 7,
    name: "Sometimes there can be multiple x's.",
    description: "This is no good, we must have only one x on one side. Dividing each side by the number of x's will get help us.",
    leftSide: [
      { type: 'unknown', value: 1 },
      { type: 'unknown', value: 1 },
    ],
    rightSide: [
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
    ],
    solution: 2,
  },
  {
    id: 8,
    name: "We like to make things complicated in maths.",
    description: "When there are multiple unknown and known weights on one side, first isolate the unknown ones before diving both sides.",
    leftSide: [
      { type: 'unknown', value: 1 },
      { type: 'unknown', value: 1 },
      { type: 'weight', value: 1 },
    ],
    rightSide: [
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },

    ],
    solution: 2,
  },
  {
    id: 9,
    name: "Lets practice another one",
    description: "Remember to isolate the unknown weights on one side first.",
    leftSide: [
      { type: 'unknown', value: 1 },
      { type: 'unknown', value: 1 },
      { type: 'balloon', value: 1 },
    ],
    rightSide: [
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
      { type: 'weight', value: 1 },
    ],
    solution: 3,
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
