# TODO.md

This file is the single source of truth for the 2048 game project progress. All tasks must be completed in order, with TODO.md updated after each task completion.

## Project Status

**Current Phase**: Phase 3 - State Management

---

## Phase 1: Project Initialization

- [x] Initialize Vite project with React + TypeScript template
  - Run `npm create vite@latest . -- --template react-ts`
  - Install dependencies

- [x] Install additional dependencies
  - Tailwind CSS and its dependencies
  - Vitest (if not included) and @testing-library/react
  - @testing-library/jest-dom

- [x] Configure Tailwind CSS
  - Create `tailwind.config.js`
  - Create `postcss.config.js`
  - Update `index.css` with Tailwind directives

- [x] Configure Vite for path aliases
  - Update `vite.config.ts` with `@/*` alias pointing to `src/*`

- [x] Update `tsconfig.json` for path aliases and strict mode
  - Add `@/*` paths configuration
  - Ensure strict mode is enabled

- [x] Configure ESLint
  - Update `.eslintrc.cjs` with React + TypeScript rules
  - Add Tailwind CSS plugin

- [x] Configure Vitest
  - Create `vitest.config.ts`
  - Update `package.json` with test scripts

---

## Phase 2: Core Game Logic (Pure Functions)

- [x] Create `src/game/types.ts`
  - Define `CellPosition`, `Tile`, `GridState`, `Direction`, `GameState`, `GameContextState`

- [x] Create `src/game/constants.ts`
  - Define grid size (4x4)
  - Define tile spawn probabilities (90% for 2, 10% for 4)
  - Define win condition value (2048)
  - Define tile value styles mapping

- [x] Implement `src/game/logic.ts` - grid initialization
  - `initializeGrid()`: Create empty 4x4 grid

- [x] Implement `src/game/logic.ts` - row/col operations
  - `shiftRow(row)`: Shift non-null tiles left, remove gaps
  - `mergeRow(row)`: Merge adjacent equal tiles
  - `rotateGrid(grid, times)`: Rotate grid for direction handling

- [x] Implement `src/game/logic.ts` - grid merge
  - `merge(grid, direction)`: Full merge operation for any direction

- [x] Implement `src/game/logic.ts` - tile operations
  - `getAvailableCells(grid)`: Return array of empty cell positions
  - `spawnTile(grid)`: Spawn new tile at random empty position with probability distribution

- [x] Implement `src/game/logic.ts` - game state checks
  - `hasWon(grid)`: Check if 2048 tile exists
  - `isGameOver(grid)`: Check if no moves possible
  - `canMove(grid)`: Check if any valid move exists

- [x] Implement `src/game/logic.ts` - score calculation
  - `calculateScore(previousGrid, currentGrid)`: Calculate score increase from merge

- [x] Create `src/__tests__/game/logic.test.ts` - initialization tests
  - Test `initializeGrid()` returns empty 4x4 grid

- [x] Complete `src/__tests__/game/logic.test.ts` - remaining tests
  - Test `merge()`, `spawnTile()`
  - Test `hasWon()`, `isGameOver()`, `canMove()`
  - Test `calculateScore()`

---

## Phase 3: State Management (React Context + Hooks)

- [x] Create `src/storage/storage.ts`
  - `saveBestScore(score)`: Save best score to localStorage
  - `loadBestScore()`: Load best score from localStorage, return 0 if not found

- [x] Create `src/__tests__/storage/storage.test.ts`
  - Test `saveBestScore()` and `loadBestScore()` persistence
  - Test `loadBestScore()` returns 0 for no stored value

- [x] Create `src/hooks/useKeyboard.ts`
  - Listen for arrow key events
  - Map key codes to Direction type
  - Prevent default scroll behavior on arrow keys

- [x] Create `src/__tests__/hooks/useKeyboard.test.tsx`
  - Test arrow key events trigger callback with correct direction
  - Test non-arrow keys are ignored

- [x] Create `src/context/GameContext.tsx` - basic setup
  - Create GameContext with TypeScript types
  - Create GameContextProvider component skeleton

- [x] Create `src/context/GameContext.tsx` - state initialization
  - Initialize state with `initializeGrid()`
  - Load best score from storage on mount
  - Spawn two initial tiles

- [x] Create `src/context/GameContext.tsx` - move implementation
  - Implement `move(direction)` function
  - Call `merge()` from game logic
  - Call `spawnTile()` if grid changed
  - Calculate and update score
  - Check win/lose conditions
  - Save best score if updated

- [x] Create `src/context/GameContext.tsx` - reset implementation
  - Implement `reset()` function
  - Re-initialize grid and score
  - Spawn two initial tiles

- [x] Create `src/context/GameContext.tsx` - keyboard integration
  - Integrate `useKeyboard` hook
  - Call `move()` on arrow key press

- [x] Create `src/__tests__/context/GameContext.test.tsx`
  - Test initial state (grid, score, bestScore, gameOver, gameWon)
  - Test `move()` updates grid and score correctly
  - Test `move()` does nothing if game is over
  - Test `reset()` re-initializes state

---

## Phase 4: UI Components

- [x] Create `src/components/Tile.tsx`
  - Basic Tile component with value prop
  - Apply Tailwind classes for styling
  - Use `React.memo` for performance

- [x] Create `src/__tests__/components/Tile.test.tsx`
  - Test Tile renders correct value
  - Test Tile applies correct classes based on value

- [x] Create `src/components/Grid.tsx`
  - Render grid background cells (empty slots)
  - Render Tile components for each non-null cell
  - Position tiles using CSS transforms

- [x] Create `src/__tests__/components/Grid.test.tsx`
  - Test Grid renders correct number of empty cells
  - Test Grid renders Tile components for each tile

- [x] Create `src/components/GameBoard.tsx`
  - Consume GameContext state
  - Render Grid with current grid state
  - Handle click/touch for mobile swipe (optional)

- [x] Create `src/__tests__/components/GameBoard.test.tsx`
  - Test GameBoard renders Grid
  - Test GameBoard updates on state change

- [x] Create `src/components/Score/Score.tsx`
  - Component to display score and best score
  - Accept score and bestScore props

- [x] Create `src/__tests__/components/Score/Score.test.tsx`
  - Test Score displays current score
  - Test Score displays best score

- [x] Create `src/components/Header/NewGameButton.tsx`
  - Button component with "New Game" text
  - Accept onClick prop

- [x] Create `src/components/Header/Header.tsx`
  - Render title "2048"
  - Render NewGameButton
  - Call reset() on NewGameButton click

- [x] Create `src/__tests__/components/Header/Header.test.tsx`
  - Test Header renders title
  - Test NewGameButton calls reset() on click

- [x] Create `src/components/Footer/Footer.tsx`
  - Render instructions for keyboard controls

- [x] Create `src/components/App.tsx`
  - Wrap components with GameContextProvider
  - Render Header, Score, GameBoard, Footer

---

## Phase 5: Polish and Features

- [x] Add GameOverlay for Game Over state
  - Display "Game Over" message
  - Display final score
  - Add "Try Again" button

- [x] Add GameOverlay for Game Won state
  - Display "You Won!" message
  - Add "Keep Playing" or "New Game" buttons

- [x] Add tile animations
  - CSS transitions for tile movement
  - CSS animations for new tile spawn
  - CSS animations for tile merge

- [x] Add undo functionality
  - Store history of states
  - Implement `undo()` function in GameContext
  - Add UndoButton to Header

- [x] Add touch/swipe support for mobile
  - Detect swipe gestures
  - Map swipe direction to game move

---

## Phase 6: Final Verification

- [x] Run all tests and verify 100% coverage for game logic
  - `npm run test:coverage`

- [x] Run type check and verify no errors
  - `npm run type-check`

- [x] Run linting and fix any issues
  - `npm run lint`

- [x] Build production bundle and verify
  - `npm run build`
  - `npm run preview`

- [x] Manual play testing
  - Test keyboard controls
  - Test win condition (reach 2048)
  - Test lose condition (no moves)
  - Test new game button
  - Test undo button (if implemented)
  - Test best score persistence (refresh page)

---

## Completed Tasks

- [x] Create `src/storage/storage.ts`
- [x] Create `src/__tests__/storage/storage.test.ts`
- [x] Create `src/hooks/useKeyboard.ts`
- [x] Create `src/__tests__/hooks/useKeyboard.test.tsx`
- [x] Create `src/context/GameContext.tsx` - basic setup
- [x] Create `src/context/GameContext.tsx` - state initialization
- [x] Create `src/context/GameContext.tsx` - move implementation
- [x] Create `src/context/GameContext.tsx` - reset implementation
- [x] Create `src/context/GameContext.tsx` - keyboard integration
- [x] Create `src/__tests__/context/GameContext.test.tsx`

---

## Notes

- Each task should be completed and verified before moving to the next
- All tasks are atomic and should be reviewable in one PR/commit
- Update this file immediately after completing each task
