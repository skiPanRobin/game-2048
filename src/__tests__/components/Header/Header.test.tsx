import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from '../../../components/Header/Header';

describe('Header', () => {
  it('renders title "2048"', () => {
    render(<Header onNewGame={() => {}} onUndo={() => {}} />);
    expect(screen.getByText('2048')).toBeDefined();
  });

  it('renders New Game button', () => {
    render(<Header onNewGame={() => {}} onUndo={() => {}} />);
    expect(screen.getByText('New Game')).toBeDefined();
  });

  it('calls onNewGame when button is clicked', () => {
    const mockOnNewGame = vi.fn();
    render(<Header onNewGame={mockOnNewGame} onUndo={() => {}} />);

    fireEvent.click(screen.getByText('New Game'));
    expect(mockOnNewGame).toHaveBeenCalledTimes(1);
  });
});
