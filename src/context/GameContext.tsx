import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { GameContextState } from '../game/types';
import type { Direction } from '../game/types';
import { initializeGrid } from '../game/logic';
import { saveBestScore, loadBestScore } from '../storage/storage';
import { merge, spawnTile, hasWon, isGameOver, calculateScore, clearAnimationFlags } from '../game/logic';
import { useKeyboard } from '../hooks/useKeyboard';

function spawnTwoTiles(grid: GameContextState['grid']): GameContextState['grid'] {
  const newGrid = grid.map(row => [...row]) as GameContextState['grid'];

  // Spawn first tile
  const grid1 = spawnTile(newGrid);

  // Spawn second tile
  const grid2 = spawnTile(grid1);

  return grid2;
}

interface GameAction {
  type: 'MOVE' | 'RESET' | 'INITIALIZE' | 'UPDATE_STATE' | 'SAVE_BEST_SCORE' | 'KEEP_PLAYING' | 'UNDO';
  payload?: {
    direction?: Direction;
    grid?: GameContextState['grid'];
    score?: GameContextState['score'];
    bestScore?: GameContextState['bestScore'];
    gameOver?: GameContextState['gameOver'];
    gameWon?: GameContextState['gameWon'];
  };
}

interface HistoryEntry {
  grid: GameContextState['grid'];
  score: number;
}

const initialState: GameContextState & { history: HistoryEntry[] } = {
  grid: [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ],
  score: 0,
  bestScore: 0,
  gameOver: false,
  gameWon: false,
  move: () => {},
  reset: () => {},
  undo: () => {},
  keepPlaying: () => {},
  history: [],
};

function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'MOVE': {
      const direction = action.payload?.direction;
      if (!direction || state.gameOver) return state;

      // Save current state to history before making a move
      const historyEntry: HistoryEntry = {
        grid: state.grid,
        score: state.score,
      };
      const newHistory = [...state.history, historyEntry];

      // Limit history to 10 entries
      if (newHistory.length > 10) {
        newHistory.shift();
      }

      // Try to merge the grid
      const newGrid = merge(state.grid, direction);

      // Check if the grid actually changed (move was valid)
      const gridChanged = JSON.stringify(state.grid) !== JSON.stringify(newGrid);

      if (gridChanged) {
        // Spawn a new tile after the move
        const gridAfterSpawn = spawnTile(newGrid);

        // Calculate score increase (must be done before clearing flags)
        const scoreIncrease = calculateScore(state.grid, gridAfterSpawn);
        const newScore = state.score + scoreIncrease;

        // Check for win condition
        const gameWon = hasWon(gridAfterSpawn);

        // Check for game over
        const gameOver = gameWon ? false : isGameOver(gridAfterSpawn);

        // Update best score if needed
        const bestScore = newScore > state.bestScore ? newScore : state.bestScore;

        // Clear animation flags after score calculation
        const gridWithClearedFlags = clearAnimationFlags(gridAfterSpawn);

        return {
          ...state,
          grid: gridWithClearedFlags,
          score: newScore,
          bestScore,
          gameWon,
          gameOver,
          history: newHistory,
        };
      }

      // No valid move - don't add to history
      return state;
    }

    case 'INITIALIZE': {
      // Create empty grid and spawn two initial tiles
      const newGrid = initializeGrid();
      const gridWithTiles = spawnTwoTiles(newGrid);
      return {
        grid: gridWithTiles,
        score: 0,
        bestScore: loadBestScore(),
        gameOver: false,
        gameWon: false,
        move: () => {},
        reset: () => {},
        undo: () => {},
        keepPlaying: () => {},
        history: [],
      };
    }

    case 'RESET': {
      const newGrid = initializeGrid();
      // Spawn two initial tiles
      const gridWithTiles = spawnTwoTiles(newGrid);
      return {
        ...state,
        grid: gridWithTiles,
        score: 0,
        bestScore: loadBestScore(),
        gameOver: false,
        gameWon: false,
        history: [],
      };
    }

    case 'UPDATE_STATE': {
      const {
        grid = state.grid,
        score = state.score,
        bestScore = state.bestScore,
        gameOver = state.gameOver,
        gameWon = state.gameWon,
      } = action.payload || {};

      return {
        ...state,
        grid,
        score,
        bestScore,
        gameOver,
        gameWon,
      };
    }

    case 'SAVE_BEST_SCORE': {
      const bestScore = action.payload?.bestScore;
      if (bestScore) {
        saveBestScore(bestScore);
      }
      return {
        ...state,
        bestScore: bestScore ?? state.bestScore,
      };
    }

    case 'KEEP_PLAYING': {
      // Continue playing after winning
      return {
        ...state,
        gameWon: false,
      };
    }

    case 'UNDO': {
      const history = state.history;
      if (history.length === 0) return state;

      // Get the last state from history
      const lastEntry = history[history.length - 1]!;

      // Remove the last entry from history
      const newHistory = history.slice(0, -1);

      return {
        ...state,
        grid: lastEntry.grid,
        score: lastEntry.score,
        gameOver: false,
        gameWon: false,
        history: newHistory,
      };
    }

    default:
      return state;
  }
}

const GameContext = createContext<GameContextState | undefined>(undefined);

interface GameProviderProps {
  children: React.ReactNode;
}

export function GameProvider({ children }: GameProviderProps): React.ReactElement {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const move = useCallback((direction: Direction): void => {
    dispatch({ type: 'MOVE', payload: { direction } });
  }, []);

  const reset = useCallback((): void => {
    dispatch({ type: 'RESET' });
  }, []);

  const undo = useCallback((): void => {
    dispatch({ type: 'UNDO' });
  }, []);

  const keepPlaying = useCallback((): void => {
    dispatch({ type: 'KEEP_PLAYING' });
  }, []);

  // Initialize the game on first render
  React.useEffect(() => {
    dispatch({ type: 'INITIALIZE' });
  }, []);

  // Integrate keyboard controls
  useKeyboard(move);

  const contextValue: GameContextState = {
    ...state,
    move,
    reset,
    undo,
    keepPlaying,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame(): GameContextState {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { gameReducer };