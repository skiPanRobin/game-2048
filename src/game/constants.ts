/**
 * Grid dimensions
 */
export const GRID_SIZE = 4;

/**
 * Tile spawn probabilities
 * - 90% chance of spawning a 2
 * - 10% chance of spawning a 4
 */
export const TILE_SPAWN_PROBABILITIES: Record<number, number> = {
  2: 0.9,
  4: 0.1,
} as const;

/**
 * Winning tile value
 */
export const WIN_VALUE = 2048;

/**
 * Tile value to CSS color class mapping
 */
export const TILE_STYLES: Record<number, { bg: string; text: string }> = {
  2: { bg: 'bg-tile-2', text: 'text-text-dark' },
  4: { bg: 'bg-tile-4', text: 'text-text-dark' },
  8: { bg: 'bg-tile-8', text: 'text-text-light' },
  16: { bg: 'bg-tile-16', text: 'text-text-light' },
  32: { bg: 'bg-tile-32', text: 'text-text-light' },
  64: { bg: 'bg-tile-64', text: 'text-text-light' },
  128: { bg: 'bg-tile-128', text: 'text-text-light' },
  256: { bg: 'bg-tile-256', text: 'text-text-light' },
  512: { bg: 'bg-tile-512', text: 'text-text-light' },
  1024: { bg: 'bg-tile-1024', text: 'text-text-light' },
  2048: { bg: 'bg-tile-2048', text: 'text-text-light' },
} as const;

/**
 * Default style for tiles > 2048
 */
export const SUPER_TILE_STYLE = { bg: 'bg-tile-super', text: 'text-text-light' } as const;

/**
 * Get tile style for a given value
 */
export function getTileStyle(value: number): { bg: string; text: string } {
  return TILE_STYLES[value] ?? SUPER_TILE_STYLE;
}

/**
 * Animation duration in milliseconds
 */
export const ANIMATION_DURATION = 150;

/**
 * Tile cell size in pixels (responsive)
 */
export const TILE_SIZE_BASE = 100;
export const TILE_GAP = 15;
