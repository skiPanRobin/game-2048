import { describe, it, expect } from 'vitest';
import {
  initializeGrid,
  createTile,
  shiftRow,
  mergeRow,
  rotateGrid,
  merge,
  getAvailableCells,
  spawnTile,
  hasWon,
  isGameOver,
  canMove,
  calculateScore,
  areGridsEqual,
  type GridState,
} from '@/game/logic';
import type { Tile } from '@/game/types';

describe('game/logic - Initialization', () => {
  describe('initializeGrid', () => {
    it('should return an empty 4x4 grid', () => {
      const grid = initializeGrid();

      expect(grid).toHaveLength(4);
      expect(grid[0]).toHaveLength(4);

      // All cells should be null
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          expect(grid[row]?.[col]).toBeNull();
        }
      }
    });

    it('should return a new grid on each call', () => {
      const grid1 = initializeGrid();
      const grid2 = initializeGrid();

      expect(grid1).not.toBe(grid2);
      expect(grid1).toEqual(grid2);
    });
  });

  describe('createTile', () => {
    it('should create a tile with the given value and position', () => {
      const tile = createTile(2, { row: 0, col: 0 });

      expect(tile.value).toBe(2);
      expect(tile.position).toEqual({ row: 0, col: 0 });
    });

    it('should create a tile with a unique id', () => {
      const tile1 = createTile(2, { row: 0, col: 0 });
      const tile2 = createTile(2, { row: 0, col: 0 });

      expect(tile1.id).not.toBe(tile2.id);
      expect(typeof tile1.id).toBe('string');
      expect(tile1.id).toMatch(/^tile-/);
    });

    it('should mark tile as new', () => {
      const tile = createTile(4, { row: 1, col: 2 });

      expect(tile.isNew).toBe(true);
    });
  });
});

describe('game/logic - Row/Column Operations', () => {
  describe('shiftRow', () => {
    it('should shift non-null tiles left, removing gaps', () => {
      const row: (Tile | null)[] = [
        null,
        createTile(2, { row: 0, col: 0 }),
        null,
        createTile(4, { row: 0, col: 3 }),
      ];

      const shifted = shiftRow(row);

      expect(shifted[0]?.value).toBe(2);
      expect(shifted[1]?.value).toBe(4);
      expect(shifted[2]).toBeNull();
      expect(shifted[3]).toBeNull();
    });

    it('should not modify an already shifted row', () => {
      const row: (Tile | null)[] = [
        createTile(2, { row: 0, col: 0 }),
        createTile(4, { row: 0, col: 1 }),
        null,
        null,
      ];

      const shifted = shiftRow(row);

      expect(shifted).toEqual(row);
    });

    it('should handle empty row', () => {
      const row = [null, null, null, null];
      const shifted = shiftRow(row);

      expect(shifted).toEqual(row);
    });

    it('should handle full row with no gaps', () => {
      const row: (Tile | null)[] = [
        createTile(2, { row: 0, col: 0 }),
        createTile(4, { row: 0, col: 1 }),
        createTile(8, { row: 0, col: 2 }),
        createTile(16, { row: 0, col: 3 }),
      ];

      const shifted = shiftRow(row);

      expect(shifted[0]?.value).toBe(2);
      expect(shifted[1]?.value).toBe(4);
      expect(shifted[2]?.value).toBe(8);
      expect(shifted[3]?.value).toBe(16);
    });
  });

  describe('mergeRow', () => {
    it('should merge adjacent equal tiles', () => {
      const row: (Tile | null)[] = [
        createTile(2, { row: 0, col: 0 }),
        createTile(2, { row: 0, col: 1 }),
        null,
        null,
      ];

      const merged = mergeRow(row);

      expect(merged[0]?.value).toBe(4);
      expect(merged[0]?.isMerged).toBe(true);
      expect(merged[0]?.isNew).toBe(false);
      expect(merged[1]).toBeNull();
      expect(merged[2]).toBeNull();
      expect(merged[3]).toBeNull();
    });

    it('should not merge non-adjacent tiles', () => {
      const row: (Tile | null)[] = [
        createTile(2, { row: 0, col: 0 }),
        null,
        createTile(2, { row: 0, col: 2 }),
        null,
      ];

      const merged = mergeRow(row);

      expect(merged[0]?.value).toBe(2);
      expect(merged[0]?.isMerged).toBeUndefined();
      expect(merged[1]?.value).toBe(2);
      expect(merged[1]?.isMerged).toBeUndefined();
      expect(merged[2]).toBeNull();
      expect(merged[3]).toBeNull();
    });

    it('should merge multiple pairs', () => {
      const row: (Tile | null)[] = [
        createTile(2, { row: 0, col: 0 }),
        createTile(2, { row: 0, col: 1 }),
        createTile(4, { row: 0, col: 2 }),
        createTile(4, { row: 0, col: 3 }),
      ];

      const merged = mergeRow(row);

      expect(merged[0]?.value).toBe(4);
      expect(merged[0]?.isMerged).toBe(true);
      expect(merged[1]?.value).toBe(8);
      expect(merged[1]?.isMerged).toBe(true);
      expect(merged[2]).toBeNull();
      expect(merged[3]).toBeNull();
    });

    it('should only merge once per tile', () => {
      const row: (Tile | null)[] = [
        createTile(2, { row: 0, col: 0 }),
        createTile(2, { row: 0, col: 1 }),
        createTile(2, { row: 0, col: 2 }),
        createTile(2, { row: 0, col: 3 }),
      ];

      const merged = mergeRow(row);

      expect(merged[0]?.value).toBe(4);
      expect(merged[0]?.isMerged).toBe(true);
      expect(merged[1]?.value).toBe(4);
      expect(merged[1]?.isMerged).toBe(true);
      expect(merged[2]).toBeNull();
      expect(merged[3]).toBeNull();
    });
  });

  describe('rotateGrid', () => {
    it('should rotate grid 0 degrees (no change)', () => {
      const grid = initializeGrid();
      const rotated = rotateGrid(grid, 0);

      expect(rotated).toEqual(grid);
    });

    it('should rotate grid 90 degrees clockwise', () => {
      const grid: (Tile | null)[][] = [
        [createTile(1, { row: 0, col: 0 }), createTile(2, { row: 0, col: 1 }), null, null],
        [createTile(3, { row: 1, col: 0 }), createTile(4, { row: 1, col: 1 }), null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const rotated = rotateGrid(grid, 1);

      // After 90° clockwise: (row, col) -> (col, 3-row)
      // (0,0)->(0,3), (0,1)->(1,3), (1,0)->(0,2), (1,1)->(1,2)
      expect(rotated[0]?.[2]?.value).toBe(3);
      expect(rotated[0]?.[3]?.value).toBe(1);
      expect(rotated[1]?.[2]?.value).toBe(4);
      expect(rotated[1]?.[3]?.value).toBe(2);
    });

    it('should rotate grid 180 degrees', () => {
      const grid: (Tile | null)[][] = [
        [createTile(1, { row: 0, col: 0 }), null, null, null],
        [null, createTile(2, { row: 1, col: 1 }), null, null],
        [null, null, createTile(3, { row: 2, col: 2 }), null],
        [null, null, null, createTile(4, { row: 3, col: 3 })],
      ];

      const rotated = rotateGrid(grid, 2);

      expect(rotated[0]?.[0]?.value).toBe(4);
      expect(rotated[1]?.[1]?.value).toBe(3);
      expect(rotated[2]?.[2]?.value).toBe(2);
      expect(rotated[3]?.[3]?.value).toBe(1);
    });

    it('should rotate grid 270 degrees clockwise (90 degrees counter-clockwise)', () => {
      const grid: (Tile | null)[][] = [
        [createTile(1, { row: 0, col: 0 }), createTile(2, { row: 0, col: 1 }), null, null],
        [createTile(3, { row: 1, col: 0 }), createTile(4, { row: 1, col: 1 }), null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const rotated = rotateGrid(grid, 3);

      // After 270° clockwise (or 90° counter-clockwise): (row, col) -> (3-col, row)
      // (0,0)->(3,0), (0,1)->(2,0), (1,0)->(3,1), (1,1)->(2,1)
      expect(rotated[2]?.[0]?.value).toBe(2);
      expect(rotated[2]?.[1]?.value).toBe(4);
      expect(rotated[3]?.[0]?.value).toBe(1);
      expect(rotated[3]?.[1]?.value).toBe(3);
    });
  });
});

describe('game/logic - Merge Operations', () => {
  describe('merge', () => {
    it('should merge left with adjacent equal tiles', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(2, { row: 0, col: 1 }), null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const merged = merge(grid, 'left');

      expect(merged[0]?.[0]?.value).toBe(4);
      expect(merged[0]?.[0]?.isMerged).toBe(true);
      expect(merged[0]?.[1]).toBeNull();
    });

    it('should merge right with adjacent equal tiles', () => {
      const grid: GridState = [
        [null, null, createTile(2, { row: 0, col: 2 }), createTile(2, { row: 0, col: 3 })],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const merged = merge(grid, 'right');

      expect(merged[0]?.[3]?.value).toBe(4);
      expect(merged[0]?.[3]?.isMerged).toBe(true);
      expect(merged[0]?.[2]).toBeNull();
    });

    it('should merge up with adjacent equal tiles', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), null, null, null],
        [createTile(2, { row: 1, col: 0 }), null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const merged = merge(grid, 'up');

      // Tiles at (0,0) and (1,0) should merge upwards to (0,0)
      expect(merged[0]?.[0]?.value).toBe(4);
      expect(merged[0]?.[0]?.isMerged).toBe(true);
    });

    it('should merge down with adjacent equal tiles', () => {
      const grid: GridState = [
        [null, null, null, null],
        [null, null, null, null],
        [createTile(2, { row: 2, col: 0 }), null, null, null],
        [createTile(2, { row: 3, col: 0 }), null, null, null],
      ];

      const merged = merge(grid, 'down');

      // Tiles at (2,0) and (3,0) should merge downwards to (3,0)
      expect(merged[3]?.[0]?.value).toBe(4);
      expect(merged[3]?.[0]?.isMerged).toBe(true);
    });

    it('should handle empty grid', () => {
      const grid = initializeGrid();
      const merged = merge(grid, 'left');

      expect(merged).toEqual(grid);
    });

    it('should handle no valid merges', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(4, { row: 0, col: 1 }), null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const merged = merge(grid, 'left');

      expect(merged[0]?.[0]?.value).toBe(2);
      expect(merged[0]?.[1]?.value).toBe(4);
    });
  });
});

describe('game/logic - Spawn Operations', () => {
  describe('getAvailableCells', () => {
    it('should return all positions for empty grid', () => {
      const grid = initializeGrid();
      const available = getAvailableCells(grid);

      expect(available).toHaveLength(16);
    });

    it('should return only empty positions', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const available = getAvailableCells(grid);

      expect(available).toHaveLength(15);
      expect(available).not.toContainEqual({ row: 0, col: 0 });
    });

    it('should return empty array for full grid', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(4, { row: 0, col: 1 }), createTile(8, { row: 0, col: 2 }), createTile(16, { row: 0, col: 3 })],
        [createTile(32, { row: 1, col: 0 }), createTile(64, { row: 1, col: 1 }), createTile(128, { row: 1, col: 2 }), createTile(256, { row: 1, col: 3 })],
        [createTile(512, { row: 2, col: 0 }), createTile(1024, { row: 2, col: 1 }), createTile(2048, { row: 2, col: 2 }), createTile(4096, { row: 2, col: 3 })],
        [createTile(8192, { row: 3, col: 0 }), createTile(16384, { row: 3, col: 1 }), createTile(32768, { row: 3, col: 2 }), createTile(65536, { row: 3, col: 3 })],
      ];

      const available = getAvailableCells(grid);

      expect(available).toHaveLength(0);
    });
  });

  describe('spawnTile', () => {
    it('should spawn a tile at an empty position', () => {
      const grid = initializeGrid();
      const newGrid = spawnTile(grid);

      // Find the spawned tile
      let tileCount = 0;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (newGrid[row]?.[col] !== null) {
            tileCount++;
            expect(newGrid[row]?.[col]?.isNew).toBe(true);
          }
        }
      }

      expect(tileCount).toBe(1);
    });

    it('should not modify full grid', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(4, { row: 0, col: 1 }), createTile(8, { row: 0, col: 2 }), createTile(16, { row: 0, col: 3 })],
        [createTile(32, { row: 1, col: 0 }), createTile(64, { row: 1, col: 1 }), createTile(128, { row: 1, col: 2 }), createTile(256, { row: 1, col: 3 })],
        [createTile(512, { row: 2, col: 0 }), createTile(1024, { row: 2, col: 1 }), createTile(2048, { row: 2, col: 2 }), createTile(4096, { row: 2, col: 3 })],
        [createTile(8192, { row: 3, col: 0 }), createTile(16384, { row: 3, col: 1 }), createTile(32768, { row: 3, col: 2 }), createTile(65536, { row: 3, col: 3 })],
      ];

      const newGrid = spawnTile(grid);

      expect(newGrid).toEqual(grid);
    });

    it('should spawn either 2 or 4', () => {
      const grid = initializeGrid();

      for (let i = 0; i < 20; i++) {
        const newGrid = spawnTile(grid);
        let value: number | undefined;
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            const cell = newGrid[row]?.[col];
            if (cell !== null && cell !== undefined) {
              value = cell.value;
            }
          }
        }
        expect(value === 2 || value === 4).toBe(true);
      }
    });
  });
});

describe('game/logic - Game State', () => {
  describe('hasWon', () => {
    it('should return true when 2048 tile exists', () => {
      const grid: GridState = [
        [createTile(2048, { row: 0, col: 0 }), null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      expect(hasWon(grid)).toBe(true);
    });

    it('should return true when tile exceeds 2048', () => {
      const grid: GridState = [
        [createTile(4096, { row: 0, col: 0 }), null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      expect(hasWon(grid)).toBe(true);
    });

    it('should return false when no 2048 tile', () => {
      const grid: GridState = [
        [createTile(1024, { row: 0, col: 0 }), null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      expect(hasWon(grid)).toBe(false);
    });

    it('should return false for empty grid', () => {
      const grid = initializeGrid();
      expect(hasWon(grid)).toBe(false);
    });
  });

  describe('isGameOver', () => {
    it('should return true for full grid with no possible merges', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(4, { row: 0, col: 1 }), createTile(2, { row: 0, col: 2 }), createTile(4, { row: 0, col: 3 })],
        [createTile(4, { row: 1, col: 0 }), createTile(2, { row: 1, col: 1 }), createTile(4, { row: 1, col: 2 }), createTile(2, { row: 1, col: 3 })],
        [createTile(2, { row: 2, col: 0 }), createTile(4, { row: 2, col: 1 }), createTile(2, { row: 2, col: 2 }), createTile(4, { row: 2, col: 3 })],
        [createTile(4, { row: 3, col: 0 }), createTile(2, { row: 3, col: 1 }), createTile(4, { row: 3, col: 2 }), createTile(2, { row: 3, col: 3 })],
      ];

      expect(isGameOver(grid)).toBe(true);
    });

    it('should return false for full grid with possible merges', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(2, { row: 0, col: 1 }), createTile(4, { row: 0, col: 2 }), createTile(8, { row: 0, col: 3 })],
        [createTile(16, { row: 1, col: 0 }), createTile(32, { row: 1, col: 1 }), createTile(64, { row: 1, col: 2 }), createTile(128, { row: 1, col: 3 })],
        [createTile(256, { row: 2, col: 0 }), createTile(512, { row: 2, col: 1 }), createTile(1024, { row: 2, col: 2 }), createTile(2048, { row: 2, col: 3 })],
        [createTile(4096, { row: 3, col: 0 }), createTile(8192, { row: 3, col: 1 }), createTile(16384, { row: 3, col: 2 }), createTile(32768, { row: 3, col: 3 })],
      ];

      expect(isGameOver(grid)).toBe(false);
    });

    it('should return false for grid with empty cells', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      expect(isGameOver(grid)).toBe(false);
    });
  });

  describe('canMove', () => {
    it('should return true for grid with empty cells', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      expect(canMove(grid)).toBe(true);
    });

    it('should return true for grid with adjacent equal tiles horizontally', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(2, { row: 0, col: 1 }), createTile(4, { row: 0, col: 2 }), createTile(8, { row: 0, col: 3 })],
        [createTile(16, { row: 1, col: 0 }), createTile(32, { row: 1, col: 1 }), createTile(64, { row: 1, col: 2 }), createTile(128, { row: 1, col: 3 })],
        [createTile(256, { row: 2, col: 0 }), createTile(512, { row: 2, col: 1 }), createTile(1024, { row: 2, col: 2 }), createTile(2048, { row: 2, col: 3 })],
        [createTile(4096, { row: 3, col: 0 }), createTile(8192, { row: 3, col: 1 }), createTile(16384, { row: 3, col: 2 }), createTile(32768, { row: 3, col: 3 })],
      ];

      expect(canMove(grid)).toBe(true);
    });

    it('should return true for grid with adjacent equal tiles vertically', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(4, { row: 0, col: 1 }), createTile(8, { row: 0, col: 2 }), createTile(16, { row: 0, col: 3 })],
        [createTile(2, { row: 1, col: 0 }), createTile(4, { row: 1, col: 1 }), createTile(8, { row: 1, col: 2 }), createTile(16, { row: 1, col: 3 })],
        [createTile(32, { row: 2, col: 0 }), createTile(64, { row: 2, col: 1 }), createTile(128, { row: 2, col: 2 }), createTile(256, { row: 2, col: 3 })],
        [createTile(512, { row: 3, col: 0 }), createTile(1024, { row: 3, col: 1 }), createTile(2048, { row: 3, col: 2 }), createTile(4096, { row: 3, col: 3 })],
      ];

      expect(canMove(grid)).toBe(true);
    });

    it('should return false for full grid with no possible merges', () => {
      const grid: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(4, { row: 0, col: 1 }), createTile(2, { row: 0, col: 2 }), createTile(4, { row: 0, col: 3 })],
        [createTile(4, { row: 1, col: 0 }), createTile(2, { row: 1, col: 1 }), createTile(4, { row: 1, col: 2 }), createTile(2, { row: 1, col: 3 })],
        [createTile(2, { row: 2, col: 0 }), createTile(4, { row: 2, col: 1 }), createTile(2, { row: 2, col: 2 }), createTile(4, { row: 2, col: 3 })],
        [createTile(4, { row: 3, col: 0 }), createTile(2, { row: 3, col: 1 }), createTile(4, { row: 3, col: 2 }), createTile(2, { row: 3, col: 3 })],
      ];

      expect(canMove(grid)).toBe(false);
    });
  });
});

describe('game/logic - Score Calculation', () => {
  describe('calculateScore', () => {
    it('should return 0 when no merge occurred', () => {
      const grid1: GridState = [
        [createTile(2, { row: 0, col: 0 }), null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const grid2: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(4, { row: 0, col: 1 }), null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const score = calculateScore(grid1, grid2);
      expect(score).toBe(0);
    });

    it('should calculate score from single merge', () => {
      const grid1: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(2, { row: 0, col: 1 }), null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const grid2 = merge(grid1, 'left');

      const score = calculateScore(grid1, grid2);
      expect(score).toBe(4);
    });

    it('should calculate score from multiple merges', () => {
      const grid1: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(2, { row: 0, col: 1 }), createTile(4, { row: 0, col: 2 }), createTile(4, { row: 0, col: 3 })],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const grid2 = merge(grid1, 'left');

      const score = calculateScore(grid1, grid2);
      expect(score).toBe(12); // 4 + 8
    });

    it('should handle complex merge scenario', () => {
      const grid1: GridState = [
        [createTile(2, { row: 0, col: 0 }), createTile(2, { row: 0, col: 1 }), null, null],
        [createTile(4, { row: 1, col: 0 }), createTile(4, { row: 1, col: 1 }), null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const grid2 = merge(grid1, 'left');

      const score = calculateScore(grid1, grid2);
      expect(score).toBe(12); // 4 + 8
    });
  });

  describe('areGridsEqual', () => {
    it('should return true for two empty grids', () => {
      const grid1 = initializeGrid();
      const grid2 = initializeGrid();

      expect(areGridsEqual(grid1, grid2)).toBe(true);
    });

    it('should return true for two identical grids with tiles', () => {
      const grid1: GridState = [
        [createTile(2, { row: 0, col: 0 }), null, null, null],
        [null, createTile(4, { row: 1, col: 1 }), null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const grid2: GridState = [
        [createTile(2, { row: 0, col: 0 }), null, null, null],
        [null, createTile(4, { row: 1, col: 1 }), null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      expect(areGridsEqual(grid1, grid2)).toBe(true);
    });

    it('should return false when grids have different values', () => {
      const grid1: GridState = [
        [createTile(2, { row: 0, col: 0 }), null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const grid2: GridState = [
        [createTile(4, { row: 0, col: 0 }), null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      expect(areGridsEqual(grid1, grid2)).toBe(false);
    });

    it('should return false when one grid has tile and other has null', () => {
      const grid1: GridState = [
        [createTile(2, { row: 0, col: 0 }), null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const grid2: GridState = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      expect(areGridsEqual(grid1, grid2)).toBe(false);
    });

    it('should return false when one grid has null and other has tile', () => {
      const grid1: GridState = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      const grid2: GridState = [
        [createTile(2, { row: 0, col: 0 }), null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];

      expect(areGridsEqual(grid1, grid2)).toBe(false);
    });
  });
});

