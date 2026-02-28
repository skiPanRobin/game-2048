import React from 'react';
import type { Tile as TileType } from '../game/types';
import { getTileStyle, TILE_SIZE_BASE, TILE_GAP } from '../game/constants';

interface TileProps {
  tile: TileType | null;
}

function TileComponent({ tile }: TileProps): React.ReactElement | null {
  if (tile === null) {
    return null;
  }

  const style = getTileStyle(tile.value);
  const size = TILE_SIZE_BASE;
  const gap = TILE_GAP;

  // Position the tile based on its grid position
  const left = tile.position.col * (size + gap);
  const top = tile.position.row * (size + gap);

  const tileStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  // Calculate font size based on value digits
  const fontSize = tile.value >= 1000 ? '2rem' : tile.value >= 100 ? '2.5rem' : '3rem';

  // Determine animation classes
  let animationClass = 'tile';
  if (tile.isNew) {
    animationClass = 'tile tile-appear';
  } else if (tile.isMerged) {
    animationClass = 'tile tile-pop';
  }

  return (
    <div
      className={`${style.bg} ${style.text} rounded-md flex items-center justify-center font-bold shadow-md ${animationClass}`}
      style={{
        ...tileStyle,
        fontSize,
      }}
    >
      {tile.value}
    </div>
  );
}

export const Tile = React.memo(TileComponent);
