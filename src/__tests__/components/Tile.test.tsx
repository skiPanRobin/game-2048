import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tile } from '../../components/Tile';
import type { Tile as TileType } from '../../game/types';

describe('Tile', () => {
  it('renders nothing when tile is null', () => {
    const { container } = render(<Tile tile={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correct value', () => {
    const tile: TileType = {
      id: 'test-tile-1',
      value: 2,
      position: { row: 0, col: 0 },
    };

    render(<Tile tile={tile} />);
    expect(screen.getByText('2')).toBeDefined();
  });

  it('renders tile 4 correctly', () => {
    const tile: TileType = {
      id: 'test-tile-2',
      value: 4,
      position: { row: 1, col: 2 },
    };

    render(<Tile tile={tile} />);
    expect(screen.getByText('4')).toBeDefined();
  });

  it('renders tile 2048 correctly', () => {
    const tile: TileType = {
      id: 'test-tile-3',
      value: 2048,
      position: { row: 3, col: 3 },
    };

    render(<Tile tile={tile} />);
    expect(screen.getByText('2048')).toBeDefined();
  });

  it('applies correct background class for value 2', () => {
    const tile: TileType = {
      id: 'test-tile-4',
      value: 2,
      position: { row: 0, col: 0 },
    };

    const { container } = render(<Tile tile={tile} />);
    const tileElement = container.querySelector('div');
    expect(tileElement).toHaveClass('bg-tile-2');
  });

  it('applies correct background class for value 8', () => {
    const tile: TileType = {
      id: 'test-tile-5',
      value: 8,
      position: { row: 0, col: 0 },
    };

    const { container } = render(<Tile tile={tile} />);
    const tileElement = container.querySelector('div');
    expect(tileElement).toHaveClass('bg-tile-8');
  });

  it('applies super tile style for value > 2048', () => {
    const tile: TileType = {
      id: 'test-tile-6',
      value: 4096,
      position: { row: 0, col: 0 },
    };

    const { container } = render(<Tile tile={tile} />);
    const tileElement = container.querySelector('div');
    expect(tileElement).toHaveClass('bg-tile-super');
  });

  it('applies dark text for small values', () => {
    const tile: TileType = {
      id: 'test-tile-7',
      value: 2,
      position: { row: 0, col: 0 },
    };

    const { container } = render(<Tile tile={tile} />);
    const tileElement = container.querySelector('div');
    expect(tileElement).toHaveClass('text-text-dark');
  });

  it('applies light text for values >= 8', () => {
    const tile: TileType = {
      id: 'test-tile-8',
      value: 8,
      position: { row: 0, col: 0 },
    };

    const { container } = render(<Tile tile={tile} />);
    const tileElement = container.querySelector('div');
    expect(tileElement).toHaveClass('text-text-light');
  });
});
