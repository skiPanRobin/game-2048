import type { CellPosition, Direction, GridState, Tile } from './types';
import { GRID_SIZE, TILE_SPAWN_PROBABILITIES, WIN_VALUE } from './constants';

/**
 * Generate a unique ID for a tile
 */
function generateTileId(): string {
  return `tile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new tile with the given value at the specified position
 */
export function createTile(value: number, position: CellPosition): Tile {
  return {
    id: generateTileId(),
    value,
    position,
    isNew: true,
  };
}

/**
 * Initialize a new empty 4x4 grid
 * @returns A 4x4 grid with all cells set to null
 */
export function initializeGrid(): GridState {
  const grid: GridState = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
  return grid;
}

/**
 * Row of tiles (from left to right)
 */
type Row = readonly (Tile | null)[];

/**
 * Shift non-null tiles left, removing gaps
 * @param row - A row of tiles
 * @returns New row with tiles shifted left, gaps removed
 */
export function shiftRow(row: Row): Row {
  const nonNullTiles = row.filter((tile): tile is Tile => tile !== null);
  const shifted = [...nonNullTiles, ...Array(row.length - nonNullTiles.length).fill(null)];
  return shifted;
}

/**
 * Merge adjacent equal tiles from left to right
 * @param row - A row of tiles (should already be shifted)
 * @returns New row with merged tiles
 */
export function mergeRow(row: Row): Row {
  const result: (Tile | null)[] = [...row];
  let i = 0;

  while (i < result.length - 1) {
    const current = result[i]!;
    const next = result[i + 1]!;

    if (current !== null && next !== null && current.value === next.value) {
      // Merge the tiles: create a new tile with doubled value
      const mergedValue = current.value * 2;
      const mergedTile: Tile = {
        id: generateTileId(),
        value: mergedValue,
        position: current.position,
        isMerged: true,
        isNew: false,
      };
      result[i] = mergedTile;
      result[i + 1] = null;
      i += 2; // Skip the merged tile
    } else {
      i += 1;
    }
  }

  // Shift again to remove gaps created by merging
  return shiftRow(result);
}

/**
 * Rotate a 90-degree clockwise rotation of a grid
 */
function rotateGridClockwise(grid: GridState): GridState {
  const newGrid: GridState = grid.map(() => Array(GRID_SIZE).fill(null));
  for (let row = 0; row < GRID_SIZE; row++) {
    const gridRow = grid[row]!;
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = gridRow[col];
      if (tile) {
        const newRow = newGrid[col]!;
        newRow[GRID_SIZE - 1 - row] = {
          ...tile,
          position: { row: col, col: GRID_SIZE - 1 - row },
        };
      }
    }
  }
  return newGrid;
}

/**
 * Rotate grid by specified number of 90-degree rotations
 * @param grid - Current grid state
 * @param times - Number of 90-degree clockwise rotations (0, 1, 2, or 3)
 * @returns New rotated grid
 */
export function rotateGrid(grid: GridState, times: 0 | 1 | 2 | 3): GridState {
  let result = grid;
  for (let i = 0; i < times; i++) {
    result = rotateGridClockwise(result);
  }
  return result;
}

/**
 * Get number of rotations needed to make a direction equivalent to 'left'
 * @param direction - The movement direction
 * @returns Number of 90-degree clockwise rotations
 */
function getRotationCount(direction: Direction): 0 | 1 | 2 | 3 {
  switch (direction) {
    case 'left':
      return 0;
    case 'up':
      return 3; // Rotate 270° clockwise - will merge to top (row 0)
    case 'right':
      return 2; // Rotate 180° to make 'right' become 'left'
    case 'down':
      return 1; // Rotate 90° clockwise - will merge to bottom (row 3)
  }
}

/**
 * Merge tiles in the specified direction
 * @param grid - Current grid state
 * @param direction - Direction to merge
 * @returns New grid state after merge
 */
export function merge(grid: GridState, direction: Direction): GridState {
  // Rotate grid so the direction becomes 'left'
  const rotationCount = getRotationCount(direction);
  const rotatedGrid = rotateGrid(grid, rotationCount);

  // Apply shift and merge to each row (all rows now move 'left')
  const mergedGrid = rotatedGrid.map((row) => {
    const shifted = shiftRow(row);
    return mergeRow(shifted);
  }) as unknown as GridState;

  // Rotate back to original orientation
  const reverseRotationCount = ((4 - rotationCount) % 4) as 0 | 1 | 2 | 3;
  return rotateGrid(mergedGrid, reverseRotationCount);
}

export type { CellPosition, Direction, GridState, Tile };

/**
 * Get all empty cell positions
 * @param grid - Current grid state
 * @returns Array of empty cell positions
 */
export function getAvailableCells(grid: GridState): readonly CellPosition[] {
  const positions: CellPosition[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    const gridRow = grid[row]!;
    for (let col = 0; col < GRID_SIZE; col++) {
      if (gridRow[col] === null) {
        positions.push({ row, col });
      }
    }
  }
  return positions;
}

/**
 * Determine the tile value based on spawn probabilities
 * @returns Tile value (2 or 4)
 */
function getTileSpawnValue(): number {
  const random = Math.random();
  const twoProbability = TILE_SPAWN_PROBABILITIES[2] ?? 0.9;
  if (random < twoProbability) {
    return 2;
  }
  return 4;
}

/**
 * Spawn a new tile at a random empty position
 * @param grid - Current grid state
 * @returns New grid state with spawned tile, or original grid if no empty cells
 */
export function spawnTile(grid: GridState): GridState {
  const availableCells = getAvailableCells(grid);

  if (availableCells.length === 0) {
    return grid;
  }

  // Select a random empty cell
  const randomIndex = Math.floor(Math.random() * availableCells.length);
  const position = availableCells[randomIndex]!;

  // Create new tile with random value
  const value = getTileSpawnValue();
  const newTile = createTile(value, position);

  // Create new grid with the tile placed
  const newGrid = grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      if (rowIndex === position.row && colIndex === position.col) {
        return newTile;
      }
      return cell;
    })
  ) as GridState;

  return newGrid;
}

/**
 * Check if two grid states are equal (for detecting changes)
 * @param grid1 - First grid state
 * @param grid2 - Second grid state
 * @returns True if grids are equal
 */
export function areGridsEqual(grid1: GridState, grid2: GridState): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile1 = grid1[row]?.[col];
      const tile2 = grid2[row]?.[col];

      if (tile1 === null && tile2 !== null) return false;
      if (tile1 !== null && tile2 === null) return false;
      if (tile1 && tile2 && tile1.value !== tile2.value) return false;
    }
  }
  return true;
}

/**
 * Check if game is won (2048 tile reached)
 * @param grid - Current grid state
 * @returns True if 2048 tile exists
 */
export function hasWon(grid: GridState): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    const gridRow = grid[row]!;
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = gridRow[col];
      if (tile && tile.value >= WIN_VALUE) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Check if any valid move exists in the grid
 * @param grid - Current grid state
 * @returns True if at least one valid move exists
 */
export function canMove(grid: GridState): boolean {
  // Check if there are empty cells
  if (getAvailableCells(grid).length > 0) {
    return true;
  }

  // Check if any adjacent tiles can be merged
  for (let row = 0; row < GRID_SIZE; row++) {
    const gridRow = grid[row]!;
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = gridRow[col];
      if (!tile) continue;

      // Check right neighbor
      if (col < GRID_SIZE - 1) {
        const rightNeighbor = gridRow[col + 1];
        if (rightNeighbor && rightNeighbor.value === tile.value) {
          return true;
        }
      }

      // Check bottom neighbor
      if (row < GRID_SIZE - 1) {
        const bottomNeighbor = grid[row + 1]![col];
        if (bottomNeighbor && bottomNeighbor.value === tile.value) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Check if game is over (no moves possible)
 * @param grid - Current grid state
 * @returns True if no valid moves exist
 */
export function isGameOver(grid: GridState): boolean {
  return !canMove(grid);
}

/**
 * Calculate score increase from grid state change
 * @param previousGrid - Grid before move (not used, kept for API compatibility)
 * @param currentGrid - Grid after move
 * @returns Score increase (0 if no merge occurred)
 */
export function calculateScore(_previousGrid: GridState, currentGrid: GridState): number {
  let scoreIncrease = 0;

  // Sum up the values of all tiles that were marked as merged
  for (let row = 0; row < GRID_SIZE; row++) {
    const gridRow = currentGrid[row]!;
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = gridRow[col];
      if (tile && tile.isMerged) {
        scoreIncrease += tile.value;
      }
    }
  }

  return scoreIncrease;
}

/**
 * Clear animation flags from all tiles in the grid
 * This should be called after score calculation to prepare for next move
 * @param grid - Current grid state
 * @returns New grid with animation flags cleared
 */
export function clearAnimationFlags(grid: GridState): GridState {
  return grid.map((row) =>
    row.map((tile) => {
      if (tile === null) return null;
      return {
        ...tile,
        isNew: false,
        isMerged: false,
      };
    })
  ) as GridState;
}
