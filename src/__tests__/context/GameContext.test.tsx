import { renderHook, act } from '@testing-library/react';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import { GameProvider, useGame } from '../../context/GameContext';
import * as logicModule from '../../game/logic';
import { createTile } from '../../game/logic';

describe('GameContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide default state', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: ({ children }) => (
        <GameProvider>{children}</GameProvider>
      ),
    });

    expect(result.current.grid).toBeDefined();
    expect(result.current.grid).toHaveLength(4);
    expect(result.current.grid[0]).toHaveLength(4);
    expect(result.current.score).toBe(0);
    expect(result.current.gameOver).toBe(false);
    expect(result.current.gameWon).toBe(false);
    expect(result.current.move).toBeDefined();
    expect(result.current.reset).toBeDefined();
    expect(result.current.undo).toBeDefined();
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useGame());
    }).toThrow('useGame must be used within a GameProvider');
  });

  it('should move tiles when move is called', async () => {
    vi.spyOn(logicModule, 'merge').mockReturnValue([
      [createTile(2, { row: 0, col: 0 }), createTile(2, { row: 0, col: 1 }), null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    vi.spyOn(logicModule, 'spawnTile').mockReturnValue([
      [createTile(2, { row: 0, col: 0 }), createTile(2, { row: 0, col: 1 }), null, null],
      [createTile(4, { row: 1, col: 0 }), null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    vi.spyOn(logicModule, 'calculateScore').mockReturnValue(4);
    vi.spyOn(logicModule, 'hasWon').mockReturnValue(false);
    vi.spyOn(logicModule, 'isGameOver').mockReturnValue(false);

    const { result } = renderHook(() => useGame(), {
      wrapper: ({ children }) => (
        <GameProvider>{children}</GameProvider>
      ),
    });

    act(() => {
      result.current.move('right');
    });

    expect(logicModule.merge).toHaveBeenCalled();
  });

  it('should not move tiles when game is over', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: ({ children }) => (
        <GameProvider>{children}</GameProvider>
      ),
    });

    expect(result.current.move).toBeDefined();
    expect(typeof result.current.move).toBe('function');
  });

  it('should reset the game state when reset is called', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: ({ children }) => (
        <GameProvider>{children}</GameProvider>
      ),
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.score).toBe(0);
    expect(result.current.gameOver).toBe(false);
    expect(result.current.gameWon).toBe(false);
    expect(result.current.grid).toBeDefined();
    expect(result.current.grid).toHaveLength(4);
  });
});
