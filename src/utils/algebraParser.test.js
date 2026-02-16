/**
 * Simple test cases for the algebra parser
 * Run this file with Node.js to verify parsing works correctly
 */

import { equationToState, stateToEquation } from './algebraParser.js'

console.log('Testing Algebra Parser\n' + '='.repeat(50))

const testCases = [
  {
    name: 'Simple addition',
    input: 'x + 3 = 5',
    expectedLeft: [
      { type: 'unknown', value: 1 },
      { type: 'weight', value: 3 },
    ],
    expectedRight: [
      { type: 'weight', value: 5 },
    ],
  },
  {
    name: 'Addition with negative in parentheses',
    input: 'x + (-2) = 5',
    expectedLeft: [
      { type: 'unknown', value: 1 },
      { type: 'balloon', value: -2 },
    ],
    expectedRight: [
      { type: 'weight', value: 5 },
    ],
  },
  {
    name: 'Subtraction (treated as negative)',
    input: 'x - 2 = 5',
    expectedLeft: [
      { type: 'unknown', value: 1 },
      { type: 'balloon', value: -2 },
    ],
    expectedRight: [
      { type: 'weight', value: 5 },
    ],
  },
  {
    name: 'Multiple terms',
    input: '2 + x + 3 = 10',
    expectedLeft: [
      { type: 'weight', value: 2 },
      { type: 'unknown', value: 1 },
      { type: 'weight', value: 3 },
    ],
    expectedRight: [
      { type: 'weight', value: 10 },
    ],
  },
  {
    name: 'Negative first term',
    input: '(-5) + x = 3',
    expectedLeft: [
      { type: 'balloon', value: -5 },
      { type: 'unknown', value: 1 },
    ],
    expectedRight: [
      { type: 'weight', value: 3 },
    ],
  },
]

// Run tests
testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}: ${testCase.name}`)
  console.log(`Input: "${testCase.input}"`)

  try {
    const result = equationToState(testCase.input)
    console.log('Parsed state:')
    console.log('  Left:', JSON.stringify(result.leftSide))
    console.log('  Right:', JSON.stringify(result.rightSide))

    // Convert back to equation string
    const backToString = stateToEquation(result)
    console.log(`Back to string: "${backToString}"`)

    // Check if parsing matches expected
    const leftMatch = JSON.stringify(result.leftSide) === JSON.stringify(testCase.expectedLeft)
    const rightMatch = JSON.stringify(result.rightSide) === JSON.stringify(testCase.expectedRight)

    if (leftMatch && rightMatch) {
      console.log('✓ PASS')
    } else {
      console.log('✗ FAIL - Does not match expected output')
      if (!leftMatch) {
        console.log('  Expected Left:', JSON.stringify(testCase.expectedLeft))
      }
      if (!rightMatch) {
        console.log('  Expected Right:', JSON.stringify(testCase.expectedRight))
      }
    }
  } catch (error) {
    console.log('✗ ERROR:', error.message)
  }
})

console.log('\n' + '='.repeat(50))
console.log('Testing complete!')
