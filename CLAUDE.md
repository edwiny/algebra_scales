# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Vision

A static web application to help high school students understand single-variable algebraic equations through an interactive visual metaphor using scales (balance beams).

## Project Overview

Algebra Scales is a web-based educational application designed to teach young high school students algebraic equations using an interactive scales metaphor:
- Positive numbers are represented as weights
- Negative numbers are represented as helium-filled balloons
- Unknown numbers (x) are represented by a triangle.
- The goal is to help students visualize and understand equation solving through balance

## Core Concept

- **Scales/Balance Beam**: Represents the equation (left side = right side)
- **1g Weights**: Represent positive numbers
- **Helium Balloons**: Represent negative numbers (provide "lift")
- **Unknown Weight (x)**: The variable to solve for

Students manipulate the visual representation to isolate x, and when x is alone on one side, its value can be determined by inspecting the weights/balloons on the other side.

## Technical Stack

- **Framework**: React
- **Build Tool**: Vite
- **Deployment**: Static files (GitHub Pages, Netlify, etc.)
- **Language**: JavaScript/JSX

### Why This Stack?

1. **Component-based architecture** - Each visual element is a composable, testable unit
2. **Vite** - Fast dev server, instant hot reload, builds to static files
3. **Easy testing** - Jest/Vitest for unit testing individual components
4. **Claude Code friendly** - Iterative development, clear component boundaries
5. **Still truly static** - Compiles to plain HTML/CSS/JS for hosting anywhere

## Architecture Principles

### Component Structure
```
src/
  components/
    Scale.jsx          # The balance beam component
    Weight.jsx         # Draggable weight (positive numbers)
    Balloon.jsx        # Draggable balloon (negative numbers)
    EquationDisplay.jsx # Shows algebraic form of current state
    Workspace.jsx      # Main interaction canvas
  utils/
    balanceLogic.js    # Pure functions for balance calculations
    algebraParser.js   # Convert visual state ↔ algebraic equation
  App.jsx
```

### Design Goals

1. **Composable** - Small, focused components that do one thing well
2. **Testable** - Pure functions and isolated components for easy unit testing
3. **Iterative** - Can develop and test each piece independently
4. **Visual clarity** - Clear metaphor between physical balance and algebra
5. **Educational** - Students can experiment and learn through interaction

## Development Approach

This project is being built with Claude Code, enabling:
- Rapid iteration on individual components
- Test-driven development for logic functions
- Visual feedback during development
- Clear separation between UI and logic

## Development Considerations

When implementing this project, consider:
- When installing tools and or dependencies, install for current user only, never globablly. If python style 'env' capability is there, use it.
- Interactive visualization of scales that responds to user input
- Clear visual metaphor for positive (weights) and negative (balloons) values
- Age-appropriate UI/UX for high school students
- Step-by-step equation solving demonstrations
- Educational scaffolding to guide learning progression
