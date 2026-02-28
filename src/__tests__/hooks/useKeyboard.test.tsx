import { renderHook, act } from '@testing-library/react';
import { vi, beforeEach, describe, expect, it } from 'vitest';
import { useKeyboard } from '../../hooks/useKeyboard';

// Mock window events
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
});

describe('useKeyboard', () => {
  const mockOnMove = vi.fn();

  beforeEach(() => {
    mockOnMove.mockClear();
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
  });

  it('should add event listener on mount', () => {
    renderHook(() => useKeyboard(mockOnMove));

    expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should remove event listener on unmount', () => {
    const { unmount } = renderHook(() => useKeyboard(mockOnMove));

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should call onMove with "up" on ArrowUp key press', () => {
    renderHook(() => useKeyboard(mockOnMove));

    const mockKeyDown = mockAddEventListener.mock.calls[0]?.[1];

    act(() => {
      mockKeyDown?.({ key: 'ArrowUp', preventDefault: vi.fn() });
    });

    expect(mockOnMove).toHaveBeenCalledWith('up');
  });

  it('should call onMove with "down" on ArrowDown key press', () => {
    renderHook(() => useKeyboard(mockOnMove));

    const mockKeyDown = mockAddEventListener.mock.calls[0]?.[1];

    act(() => {
      mockKeyDown?.({ key: 'ArrowDown', preventDefault: vi.fn() });
    });

    expect(mockOnMove).toHaveBeenCalledWith('down');
  });

  it('should call onMove with "left" on ArrowLeft key press', () => {
    renderHook(() => useKeyboard(mockOnMove));

    const mockKeyDown = mockAddEventListener.mock.calls[0]?.[1];

    act(() => {
      mockKeyDown?.({ key: 'ArrowLeft', preventDefault: vi.fn() });
    });

    expect(mockOnMove).toHaveBeenCalledWith('left');
  });

  it('should call onMove with "right" on ArrowRight key press', () => {
    renderHook(() => useKeyboard(mockOnMove));

    const mockKeyDown = mockAddEventListener.mock.calls[0]?.[1];

    act(() => {
      mockKeyDown?.({ key: 'ArrowRight', preventDefault: vi.fn() });
    });

    expect(mockOnMove).toHaveBeenCalledWith('right');
  });

  it('should ignore non-arrow keys', () => {
    renderHook(() => useKeyboard(mockOnMove));

    const mockKeyDown = mockAddEventListener.mock.calls[0]?.[1];

    act(() => {
      mockKeyDown?.({ key: 'Space', preventDefault: vi.fn() });
    });

    expect(mockOnMove).not.toHaveBeenCalled();
  });

  it('should prevent default scroll behavior on arrow keys', () => {
    const preventDefault = vi.fn();
    renderHook(() => useKeyboard(mockOnMove));

    const mockKeyDown = mockAddEventListener.mock.calls[0]?.[1];

    act(() => {
      mockKeyDown?.({ key: 'ArrowUp', preventDefault });
    });

    expect(preventDefault).toHaveBeenCalled();
  });

  it('should update callback when onMove changes', () => {
    const newOnMove = vi.fn();
    const { rerender } = renderHook(
      ({ onMove }) => useKeyboard(onMove),
      { initialProps: { onMove: mockOnMove } }
    );

    rerender({ onMove: newOnMove });

    expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
    expect(mockAddEventListener).toHaveBeenCalledTimes(2);
  });
});