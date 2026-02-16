# Algebra Parser Documentation

## Overview

The algebra parser (`src/utils/algebraParser.js`) converts between visual equation states and algebraic notation strings.

## Features

### Parsing Input Formats

The parser can handle multiple formats for the same equation:

1. **Simple Addition**: `x + 3 = 5`
2. **Negative Numbers in Parentheses**: `x + (-2) = 5`
3. **Subtraction Operations**: `x - 2 = 5`
4. **Multiple Terms**: `2 + x + 3 = 10`
5. **Negative First Term**: `(-5) + x = 3`

### Internal Representation

Equations are stored as state objects with two sides:

```javascript
{
  leftSide: [
    { type: 'unknown', value: 1 },      // represents x
    { type: 'weight', value: 3 },       // positive number (weights)
    { type: 'balloon', value: -2 },     // negative number (balloons)
  ],
  rightSide: [
    { type: 'weight', value: 5 },
  ]
}
```

### Visual Metaphor

- **Weights** (blue cubes): Positive numbers, pull the scale down
- **Balloons** (red balloons): Negative numbers, lift the scale up
- **Triangle** (orange): Unknown variable (x)

### Display Format

When converting back to algebraic notation:
- Weights are shown as positive numbers: `3`
- Balloons are shown as negative numbers in parentheses: `+ (-2)`
- Unknown is shown as: `x`

Example outputs:
- `x + 3 = 5` (weights only)
- `x + (-2) = 5` (weight and balloon)
- `(-5) + x = 3` (balloon first, then unknown)

## Usage

### Parsing an Equation String

```javascript
import { equationToState } from './utils/algebraParser'

const state = equationToState('x + (-2) = 5')
// Returns:
// {
//   leftSide: [
//     { type: 'unknown', value: 1 },
//     { type: 'balloon', value: -2 }
//   ],
//   rightSide: [
//     { type: 'weight', value: 5 }
//   ]
// }
```

### Converting State to Equation String

```javascript
import { stateToEquation } from './utils/algebraParser'

const equation = stateToEquation({
  leftSide: [
    { type: 'unknown', value: 1 },
    { type: 'weight', value: 3 }
  ],
  rightSide: [
    { type: 'weight', value: 5 }
  ]
})
// Returns: "x + 3 = 5"
```

## Testing

Run the test suite to verify parser functionality:

```bash
node src/utils/algebraParser.test.js
```

All tests should pass, demonstrating correct parsing of various equation formats.

## Notes

- Subtraction operations (e.g., `x - 2`) are internally converted to addition with negative numbers (`x + (-2)`)
- This normalization makes the visual metaphor clearer: "subtracting 2" becomes "adding a balloon with lift -2"
- The parser handles spaces flexibly and normalizes them in the output
