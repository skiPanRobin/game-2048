import React from 'react';
import type { GridState } from '../game/types';
import { GRID_SIZE, TILE_SIZE_BASE, TILE_GAP } from '../game/constants';
import { Tile } from './Tile';

interface GridProps {
  grid: GridState;
}

function GridComponent({ grid }: GridProps): React.ReactElement {
  const gridSize = TILE_SIZE_BASE;
  const gap = TILE_GAP;
  const containerSize = GRID_SIZE * gridSize + (GRID_SIZE - 1) * gap;

  return (
    <div
      className="relative bg-game-container rounded-lg p-3"
      style={{
        width: `${containerSize}px`,
        height: `${containerSize}px`,
      }}
    >
      {/* Background cells */}
      <div
        className="absolute flex flex-wrap"
        style={{
          gap: `${gap}px`,
          width: `${gridSize * GRID_SIZE + gap * (GRID_SIZE - 1)}px`,
          height: `${gridSize * GRID_SIZE + gap * (GRID_SIZE - 1)}px`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
          <div
            key={`cell-${index}`}
            className="bg-grid-cell rounded-md"
            style={{
              width: `${gridSize}px`,
              height: `${gridSize}px`,
            }}
          />
        ))}
      </div>

      {/* Tiles layer */}
      <div className="absolute inset-0 overflow-hidden" style={{ padding: '12px' }}>
        {grid.flatMap((row, rowIndex) =>
          row
            .map((tile, colIndex) => {
              if (tile === null) return null;
              return (
                <Tile
                  key={tile.id}
                  tile={{
                    ...tile,
                    position: { row: rowIndex, col: colIndex },
                  }}
                />
              );
            })
            .filter((tile): tile is React.ReactElement => tile !== null)
        )}
      </div>
    </div>
  );
}

export const Grid = React.memo(GridComponent);
