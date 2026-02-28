#   

This document defines the system architecture for the 2048 game implementation. All architectural decisions must align with the tech stack and principles defined in CLAUDE.md.

## 1. System Overview

### 1.1 Architectural Principles

The 2048 game follows a layered architecture with clear separation of concerns:

1. **Separation of Concerns**: Each layer has distinct responsibilities - UI components focus on presentation, game logic handles pure algorithms, state management provides the glue layer.
2. **Single Source of Truth**: Game state is managed centrally via React Context, eliminating state duplication and synchronization issues.
3. **Functional Programming**: Core game algorithms are pure functions - no side effects, easy to test, predictable behavior.
4. **Type Safety**: All code uses TypeScript with strict mode enabled - no `any` types, exhaustive type definitions.
5. **Testability**: Game logic is decoupled from React, allowing unit tests without rendering overhead.
6. **Component Composition**: Small, reusable components composed together to build complex UI.

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Presentation Layer                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Header  │  │  Score   │  │GameBoard │  │  Footer  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ useContext, useGame
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   State Management Layer                        │
│                    (React Context + Hooks)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    GameContext                            │  │
│  │  - grid: GridState                                        │  │
│  │  - score: number                                         │  │
│  │  - bestScore: number                                     │  │
│  │  - gameOver: boolean                                     │  │
│  │  - gameWon: boolean                                      │  │
│  │  - move(direction): void                                 │  │
│  │  - reset(): void                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ imports
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Game Logic Layer                           │
│                   (Pure Functions, Side-Effect Free)            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   game/logic.ts                           │  │
│  │  - initializeGrid(): GridState                           │  │
│  │  - merge(grid, direction): GridState                     │  │
│  │  - canMove(grid): boolean                                │  │
│  │  - getAvailableCells(grid): Cell[]                       │  │
│  │  - spawnTile(grid): GridState                            │  │
│  │  - hasWon(grid): boolean                                 │  │
│  │  - calculateScore(previous, current): number             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ localStorage
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Data Persistence Layer                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  storage.ts                              │  │
│  │  - saveBestScore(score): void                            │  │
│  │  - loadBestScore(): number                               │  │
│  │  - saveGameState(state): void                            │  │
│  │  - loadGameState(): GameState | null                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Data Flow and State Management

### 2.1 State Schema

```typescript
// Grid and Tile Types
type CellPosition = { row: number; col: number };

interface Tile {
  id: string;
  value: number;
  position: CellPosition;
  isNew?: boolean;
  isMerged?: boolean;
}

type GridState = readonly (Tile | null)[][];

// Direction for movement
type Direction = 'up' | 'down' | 'left' | 'right';

// Main Game State
interface GameState {
  grid: GridState;
  score: number;
  bestScore: number;
  gameOver: boolean;
  gameWon: boolean;
}

// Context State and Actions
interface GameContextState extends GameState {
  move: (direction: Direction) => void;
  reset: () => void;
  undo: () => void;
}
```

### 2.2 State Transition Flow

```
User Input (Arrow Key / Swipe)
        │
        ▼
  Handle Input Event
        │
        ▼
  ┌─────────────────┐
  │   GameContext   │
  │   move(dir)     │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  game/logic.ts  │
  │  merge(grid)    │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  game/logic.ts  │
  │  spawnTile()    │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  game/logic.ts  │
  │  canMove()      │
  │  hasWon()       │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │   GameContext   │
  │  update state    │
  └────────┬────────┘
           │
           ▼
    Re-render UI
           │
           ▼
  ┌─────────────────┐
  │  Storage Layer  │
  │  (bestScore)    │
  └─────────────────┘
```

### 2.3 Context Provider Interface

```typescript
interface GameContextProviderProps {
  children: React.ReactNode;
  initialBestScore?: number;
  enableUndo?: boolean;
  enablePersistence?: boolean;
}

const GameContextProvider: React.FC<GameContextProviderProps> = ({
  children,
  initialBestScore = 0,
  enableUndo = true,
  enablePersistence = true
}) => {
  // Provider implementation
};
```

## 3. Component Hierarchy and Module Organization

### 3.1 Component Tree

```
App
├── Header
│   ├── Logo
│   └── Controls
│       ├── NewGameButton
│       └── UndoButton (conditional)
├── Score
│   ├── CurrentScore
│   └── BestScore
├── GameBoard
│   └── Grid
│       └── Tile (multiple instances)
├── GameOverlay
│   ├── GameOver (conditional)
│   └── GameWon (conditional)
└── Footer
    └── Instructions
```

### 3.2 Component Contracts

#### `App` (Root Component)
- **Responsibility**: Application shell, provides GameContext
- **Props**: None
- **Uses**: GameContextProvider, Header, Score, GameBoard

#### `Header`
- **Responsibility**: App title and control buttons
- **Props**: `onNewGame: () => void`, `canUndo: boolean`, `onUndo: () => void`
- **Uses**: NewGameButton, UndoButton

#### `Score`
- **Responsibility**: Display current and best scores
- **Props**: `score: number`, `bestScore: number`
- **Uses**: CurrentScore, BestScore

#### `GameBoard`
- **Responsibility**: Grid container and tile rendering
- **Props**: `grid: GridState`, `gameOver: boolean`, `gameWon: boolean`
- **Uses**: Grid, Tile, GameOverlay

#### `Tile`
- **Responsibility**: Individual tile rendering with animation
- **Props**: `tile: Tile`
- **Uses**: None (leaf component)

#### `GameOverlay`
- **Responsibility**: Game over/win message overlay
- **Props**: `gameOver: boolean`, `gameWon: boolean`, `onNewGame: () => void`
- **Uses**: None

### 3.3 Module Organization

```
src/
├── components/
│   ├── App.tsx
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── NewGameButton.tsx
│   │   └── UndoButton.tsx
│   ├── Score/
│   │   ├── Score.tsx
│   │   ├── CurrentScore.tsx
│   │   └── BestScore.tsx
│   ├── GameBoard/
│   │   ├── GameBoard.tsx
│   │   ├── Grid.tsx
│   │   ├── Tile.tsx
│   │   └── GameOverlay.tsx
│   └── Footer/
│       └── Footer.tsx
├── context/
│   └── GameContext.tsx
├── game/
│   ├── logic.ts
│   ├── types.ts
│   └── constants.ts
├── hooks/
│   ├── useGame.ts
│   ├── useKeyboard.ts
│   └── useLocalStorage.ts
├── storage/
│   └── storage.ts
├── styles/
│   └── globals.css
├── __tests__/
│   ├── game/
│   │   └── logic.test.ts
│   ├── hooks/
│   │   └── useGame.test.tsx
│   └── components/
│       └── GameBoard.test.tsx
├── main.tsx
├── vite-env.d.ts
└── index.css
```

## 4. Game Logic Layer

All game logic functions are **pure** and **side-effect free**. They are implemented in `game/logic.ts` and extensively tested.

### 4.1 Grid Operations

```typescript
/**
 * Initialize a new empty 4x4 grid
 */
function initializeGrid(): GridState;

/**
 * Merge tiles in the specified direction
 * @param grid - Current grid state
 * @param direction - Direction to merge
 * @returns New grid state after merge
 */
function merge(grid: GridState, direction: Direction): GridState;

/**
 * Check if any move is possible
 */
function canMove(grid: GridState): boolean;

/**
 * Get all empty cell positions
 */
function getAvailableCells(grid: GridState): CellPosition[];
```

### 4.2 Tile Operations

```typescript
/**
 * Spawn a new tile at a random empty position
 * @param grid - Current grid state
 * @returns New grid state with spawned tile
 *
 * Tile value distribution:
 * - 90% chance of spawning a 2
 * - 10% chance of spawning a 4
 */
function spawnTile(grid: GridState): GridState;
```

### 4.3 Score Operations

```typescript
/**
 * Calculate score increase from grid state change
 * @param previousGrid - Grid before move
 * @param currentGrid - Grid after move
 * @returns Score increase (0 if no merge occurred)
 */
function calculateScore(
  previousGrid: GridState,
  currentGrid: GridState
): number;
```

### 4.4 Game State Determination

```typescript
/**
 * Check if game is won (2048 tile reached)
 */
function hasWon(grid: GridState): boolean;

/**
 * Check if game is over (no moves possible)
 */
function isGameOver(grid: GridState): boolean;
```

## 5. Testing Architecture

### 5.1 Testing Pyramid

```
                  ┌─────────┐
                  │   5%    │  E2E Tests (Playwright/Vitest)
                  │   E2E   │  - Full user flows
                  └─────────┘
                ┌─────────────┐
                │    25%      │  Component Tests (Testing Library)
                │  Component  │  - User interactions
                └─────────────┘
            ┌─────────────────┐
            │      70%        │  Unit Tests (Vitest)
            │      Unit       │  - Game logic functions
            └─────────────────┘  - Hooks
```

### 5.2 Test Organization

```
src/__tests__/
├── game/
│   └── logic.test.ts          # Pure function tests
│       - merge()
│       - spawnTile()
│       - canMove()
│       - hasWon()
│       - isGameOver()
├── hooks/
│   └── useGame.test.tsx        # Custom hook tests
│       - State transitions
│       - Reset behavior
│       - Undo functionality
├── components/
│   ├── GameBoard.test.tsx      # Component tests
│   │   - Renders correctly
│   │   - Updates on state change
│   │   - Handles keyboard input
│   └── Tile.test.tsx
│       - Renders correct value
│       - Applies correct styles
└── e2e/
    └── game-flow.test.ts       # E2E tests (if needed)
        - Complete game flow
        - Win condition
        - Lose condition
```

### 5.3 Coverage Targets

| Module Type | Target Coverage |
|------------|-----------------|
| Game Logic (`game/logic.ts`) | 100% |
| Storage (`storage.ts`) | 100% |
| Hooks (`hooks/*.ts`) | 95%+ |
| Components (`components/**/*.tsx`) | 90%+ |

### 5.4 Testing Best Practices

1. **Unit Tests**: Test pure functions with various edge cases. No rendering, no React.
2. **Component Tests**: Use Testing Library. Test user behavior, not implementation details (avoid testing internal state).
3. **Hook Tests**: Use `@testing-library/react-hooks` wrapper or React Testing Library's `renderHook`.
4. **Mock Strategy**: Only mock external dependencies (localStorage, random). Never mock the code under test.

## 6. Directory Structure Guidance

### 6.1 Full Project Structure

```
game_2048/
├── ARCHITECTURE.md          # This file - system architecture
├── CLAUDE.md                # Project instructions for Claude
├── TODO.md                  # Single source of truth for progress
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .gitignore
├── index.html
└── src/
    ├── main.tsx             # Application entry point
    ├── vite-env.d.ts        # Vite type definitions
    ├── index.css             # Global styles
    ├── components/           # React components
    ├── context/              # React Context providers
    ├── game/                 # Pure game logic
    ├── hooks/                # Custom React hooks
    ├── storage/              # Data persistence utilities
    ├── styles/               # Additional styles
    └── __tests__/            # Test files
```

### 6.2 File Naming Conventions

- **Components**: PascalCase (e.g., `GameBoard.tsx`, `NewGameButton.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGame.ts`, `useKeyboard.ts`)
- **Utilities/Logic**: camelCase (e.g., `logic.ts`, `storage.ts`)
- **Types**: `types.ts` in each module folder
- **Constants**: `constants.ts` in each module folder
- **Tests**: `<module>.test.ts` or `<Component>.test.tsx`

### 6.3 Import Conventions

```typescript
// 1. External libraries first
import React from 'react';
import { render } from '@testing-library/react';

// 2. Internal type imports
import type { GameState, Direction } from '../game/types';

// 3. Internal module imports (relative)
import { GameContext } from '../context/GameContext';
import { merge, spawnTile } from '../game/logic';
import { useGame } from '../hooks/useGame';
```

Use path aliases (configured in `tsconfig.json`) for cleaner imports:

```typescript
import { GameContext } from '@/context/GameContext';
import { merge, spawnTile } from '@/game/logic';
```

## 7. Performance Considerations

### 7.1 Rendering Optimization

1. **Memoization**:
   - Use `React.memo` for `Tile` component (prevents re-render when other tiles change)
   - Use `useMemo` for expensive computations in GameContext
   - Use `useCallback` for event handlers passed to child components

2. **Derived State**:
   - Compute derived values (like `gameWon`, `gameOver`) during state update, not during render
   - Avoid complex computations inside render functions

3. **Callback Stabilization**:
   ```typescript
   const move = useCallback((direction: Direction) => {
     // Implementation
   }, [/* dependencies */]);
   ```

### 7.2 Animation Performance

1. **CSS Transitions**: Use CSS transitions for tile movement animations (hardware accelerated)
   - Property: `transform`, `opacity`
   - Avoid: `top`, `left`, `width`, `height` (trigger reflow)

2. **RequestAnimationFrame**: Use RAF for continuous animations (if needed)

3. **Animation States**: Minimize state updates during animations

### 7.3 Bundle Size Management

1. **Tree Shaking**: Ensure unused code is eliminated (automatic with Vite)
2. **Code Splitting**: Lazy load non-critical components (if needed in future)
3. **Bundle Analysis**: Run `npm run build` and check bundle size

## 8. Development Workflow Alignment

### 8.1 Atomic Task Decomposition

Each feature must be decomposed into atomic tasks that:
- Follow single-responsibility principle
- Have constrained code change scope (reviewable in one PR)
- Can be tested independently

### 8.2 TODO.md Integration

Before starting any task:
1. Read TODO.md to understand current priorities
2. Mark task as in-progress when starting
3. Update TODO.md immediately after completing a task

### 8.3 Closure Validation Criteria

A task is considered complete when:
1. All new/modified tests pass
2. No regression in existing tests
3. Code passes linting
4. Code passes type checking (`npm run type-check`)
5. TODO.md is updated with `[x]` completion marker

### 8.4 Development Commands Flow

```bash
# 1. Start task (read TODO.md first)
npm run dev

# 2. Implement changes
# ... write code ...

# 3. Run tests
npm run test

# 4. Type check
npm run type-check

# 5. Lint
npm run lint

# 6. Build check (optional)
npm run build

# 7. Update TODO.md
# ... mark task as complete ...
```

## Appendix: Key Design Decisions

### A. Why React Context over Redux/Zustand?
- Simpler for this scope (single source of truth for game state)
- No additional dependencies
- Better alignment with React 18+ concurrent features

### B. Why Pure Functions for Game Logic?
- Easy to test (no React context needed)
- Predictable behavior
- Enables offline/undo features (state can be serialized)
- Performance optimizations (can memoize results)

### C. Why Tailwind CSS?
- No custom CSS build step needed
- Consistent design system
- Easy to prototype
- Small bundle size (purged unused styles)

### D. Why TypeScript Strict Mode?
- Catches bugs at compile time
- Better IDE support with autocomplete
- Self-documenting code (types serve as documentation)
- Refactoring safety
