import { useEffect } from 'react';
import type { Direction } from '../game/types';

type Callback = (direction: Direction) => void;

export const useKeyboard = (onMove: Callback): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      // Prevent default scroll behavior on arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(event.key) !== -1) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowUp':
          onMove('up');
          break;
        case 'ArrowDown':
          onMove('down');
          break;
        case 'ArrowLeft':
          onMove('left');
          break;
        case 'ArrowRight':
          onMove('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMove]);
};