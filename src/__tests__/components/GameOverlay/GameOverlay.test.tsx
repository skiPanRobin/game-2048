import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameOverlay } from '../../../components/GameOverlay/GameOverlay';

describe('GameOverlay', () => {
  it('renders game over message', () => {
    const handleRestart = vi.fn();
    render(
      <GameOverlay type="gameOver" score={100} onRestart={handleRestart} />
    );
    expect(screen.getByText('Game Over!')).toBeDefined();
  });

  it('renders score for game over', () => {
    const handleRestart = vi.fn();
    render(
      <GameOverlay type="gameOver" score={100} onRestart={handleRestart} />
    );
    expect(screen.getByText(/Score:/)).toBeDefined();
    expect(screen.getByText('100')).toBeDefined();
  });

  it('renders you won message', () => {
    const handleRestart = vi.fn();
    render(
      <GameOverlay type="gameWon" score={2048} onRestart={handleRestart} />
    );
    expect(screen.getByText('You Won!')).toBeDefined();
  });

  it('calls onRestart when Try Again button is clicked', () => {
    const handleRestart = vi.fn();
    render(
      <GameOverlay type="gameOver" score={100} onRestart={handleRestart} />
    );
    fireEvent.click(screen.getByText('Try Again'));
    expect(handleRestart).toHaveBeenCalledTimes(1);
  });

  it('calls onRestart when New Game button is clicked (game won)', () => {
    const handleRestart = vi.fn();
    render(
      <GameOverlay type="gameWon" score={2048} onRestart={handleRestart} />
    );
    fireEvent.click(screen.getByText('New Game'));
    expect(handleRestart).toHaveBeenCalledTimes(1);
  });

  it('shows Keep Playing button for game won state', () => {
    const handleRestart = vi.fn();
    const handleKeepPlaying = vi.fn();
    render(
      <GameOverlay
        type="gameWon"
        score={2048}
        onRestart={handleRestart}
        onKeepPlaying={handleKeepPlaying}
      />
    );
    expect(screen.getByText('Keep Playing')).toBeDefined();
  });

  it('calls onKeepPlaying when Keep Playing button is clicked', () => {
    const handleRestart = vi.fn();
    const handleKeepPlaying = vi.fn();
    render(
      <GameOverlay
        type="gameWon"
        score={2048}
        onRestart={handleRestart}
        onKeepPlaying={handleKeepPlaying}
      />
    );
    fireEvent.click(screen.getByText('Keep Playing'));
    expect(handleKeepPlaying).toHaveBeenCalledTimes(1);
  });
});
