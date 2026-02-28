/**
 * Position of a cell on the grid
 */
export interface CellPosition {
  readonly row: number;
  readonly col: number;
}

/**
 * Individual tile on the grid
 */
export interface Tile {
  readonly id: string;
  readonly value: number;
  readonly position: CellPosition;
  readonly isNew?: boolean;
  readonly isMerged?: boolean;
}

/**
 * 4x4 grid state with tiles
 * Each cell is either a Tile or null (empty)
 */
export type GridState = readonly (Tile | null)[][];

/**
 * Direction for tile movement
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Complete game state
 */
export interface GameState {
  readonly grid: GridState;
  readonly score: number;
  readonly bestScore: number;
  readonly gameOver: boolean;
  readonly gameWon: boolean;
}

/**
 * Game context state extending GameState with actions
 */
export interface GameContextState extends GameState {
  move: (direction: Direction) => void;
  reset: () => void;
  undo: () => void;
  keepPlaying: () => void;
  history: { grid: GridState; score: number }[];
}
