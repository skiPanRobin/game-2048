import { useEffect, useRef, useCallback } from 'react';
import type { Direction } from '../game/types';

interface UseSwipeOptions {
  onSwipe: (direction: Direction) => void;
  minSwipeDistance?: number;
}

export function useSwipe({ onSwipe, minSwipeDistance = 50 }: UseSwipeOptions): void {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      if (!touch) return;

      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine if the swipe is horizontal or vertical
      if (absDeltaX < minSwipeDistance && absDeltaY < minSwipeDistance) {
        return;
      }

      // Determine direction based on which axis has larger movement
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          onSwipe('right');
        } else {
          onSwipe('left');
        }
      } else {
        // Vertical swipe
        // Direct mapping: swipe up (negative deltaY) → 'up', swipe down (positive deltaY) → 'down'
        if (deltaY > 0) {
          onSwipe('down');
        } else {
          onSwipe('up');
        }
      }
    },
    [onSwipe, minSwipeDistance]
  );

  useEffect(() => {
    const element = document;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);
}
