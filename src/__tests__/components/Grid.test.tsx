import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Grid } from '../../components/Grid';
import type { GridState } from '../../game/types';

describe('Grid', () => {
  const createEmptyGrid = (): GridState =>
    Array.from({ length: 4 }, () => Array(4).fill(null));

  it('renders 16 empty background cells', () => {
    const grid = createEmptyGrid();
    render(<Grid grid={grid} />);

    const backgroundCells = document.querySelectorAll('.bg-grid-cell');
    expect(backgroundCells).toHaveLength(16);
  });

  it('renders no tiles when grid is empty', () => {
    const grid = createEmptyGrid();
    render(<Grid grid={grid} />);

    // Should not find any tile values
    const tiles = document.querySelectorAll('.rounded-md:not(.bg-grid-cell)');
    expect(tiles).toHaveLength(0);
  });

  it('renders Tile components for non-null cells', () => {
    const grid: GridState = [
      [
        { id: 'tile-1', value: 2, position: { row: 0, col: 0 } },
        null,
        null,
        null,
      ],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    render(<Grid grid={grid} />);
    expect(screen.getByText('2')).toBeDefined();
  });

  it('renders multiple tiles correctly', () => {
    const grid: GridState = [
      [
        { id: 'tile-1', value: 2, position: { row: 0, col: 0 } },
        { id: 'tile-2', value: 4, position: { row: 0, col: 1 } },
        null,
        null,
      ],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    render(<Grid grid={grid} />);
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
  });

  it('renders a full grid of tiles', () => {
    const grid: GridState = [
      [
        { id: 'tile-1', value: 2, position: { row: 0, col: 0 } },
        { id: 'tile-2', value: 4, position: { row: 0, col: 1 } },
        { id: 'tile-3', value: 8, position: { row: 0, col: 2 } },
        { id: 'tile-4', value: 16, position: { row: 0, col: 3 } },
      ],
      [
        { id: 'tile-5', value: 32, position: { row: 1, col: 0 } },
        { id: 'tile-6', value: 64, position: { row: 1, col: 1 } },
        { id: 'tile-7', value: 128, position: { row: 1, col: 2 } },
        { id: 'tile-8', value: 256, position: { row: 1, col: 3 } },
      ],
      [
        { id: 'tile-9', value: 512, position: { row: 2, col: 0 } },
        { id: 'tile-10', value: 1024, position: { row: 2, col: 1 } },
        { id: 'tile-11', value: 2048, position: { row: 2, col: 2 } },
        { id: 'tile-12', value: 4096, position: { row: 2, col: 3 } },
      ],
      [
        { id: 'tile-13', value: 8192, position: { row: 3, col: 0 } },
        { id: 'tile-14', value: 16384, position: { row: 3, col: 1 } },
        { id: 'tile-15', value: 32768, position: { row: 3, col: 2 } },
        { id: 'tile-16', value: 65536, position: { row: 3, col: 3 } },
      ],
    ];

    render(<Grid grid={grid} />);

    // Should render all 16 tiles - check tile count by counting rendered tiles
    const renderedTiles = document.querySelectorAll('.rounded-md:not(.bg-grid-cell)');
    expect(renderedTiles).toHaveLength(16);
  });
});
