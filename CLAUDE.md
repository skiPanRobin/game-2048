# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest + Testing Library

## Common Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing
```bash
npm run test         # Run all tests
npm run test:ui      # Run tests in UI mode
npm run test:coverage  # Generate coverage report
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type check
```

## Architecture

### State Management
- Use **React Context + hooks** for game state
- Core game logic (grid state, merge operations, score) should be in a `GameContext` or similar
- Keep business logic separate from UI components

### Component Structure
Organize components by functional modules:
- `GameBoard` - Main grid container
- `Tile` - Individual number tile
- `Score` - Score and best score display
- `Header` - App header with controls (reset, etc.)

### Code Style
- **Always** use functional components with hooks (no class components)
- TypeScript for all components - proper types, no `any`
- Tailwind for styling - prefer utility classes over custom CSS

### Testing Strategy
- Use Vitest + Testing Library
- Test game logic (merge, spawn, movement) independently from UI
- Component tests should verify user interactions, not implementation details

## Workflow

### Task Management Protocol

**1. Single Source of Truth**
`TODO.md` in the repository root is the single source of truth for project progress. Before initiating any new task, this file must be read to verify current priorities.

**2. Atomic Task Decomposition**
All feature requirements must be decomposed into atomic tasks. Each task must adhere to the single-responsibility principle, and its code change scope must be constrained to a reviewable size.

**3. Real-time State Synchronization**
- **Task Initiation**: Explicitly mark the task as in-progress.
- **Task Completion**: After passing all relevant tests and lint checks, `TODO.md` must be updated immediately to mark the corresponding item as completed `[x]`.
- **Dynamic Planning**: Each status update must trigger a reassessment and refinement of subsequent items based on current implementation state.

**4. Closure Validation**
Transitioning to an unrelated task without updating the `TODO.md` status is strictly prohibited.
