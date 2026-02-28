import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GameBoard } from '../../components/GameBoard';
import { GameProvider } from '../../context/GameContext';

describe('GameBoard', () => {
  it('renders Grid component', () => {
    render(
      <GameProvider>
        <GameBoard />
      </GameProvider>
    );

    // Grid should render background cells
    const backgroundCells = document.querySelectorAll('.bg-grid-cell');
    expect(backgroundCells).toHaveLength(16);
  });

  it('renders within GameProvider context', () => {
    render(
      <GameProvider>
        <GameBoard />
      </GameProvider>
    );

    // GameBoard should render without errors
    expect(document.querySelector('.flex.items-center.justify-center')).toBeDefined();
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<GameBoard />);
    }).toThrow('useGame must be used within a GameProvider');

    consoleSpy.mockRestore();
  });
});
