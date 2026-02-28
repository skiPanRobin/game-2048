import React from 'react';

export type OverlayType = 'gameOver' | 'gameWon';

interface GameOverlayProps {
  type: OverlayType;
  score: number;
  onRestart: () => void;
  onKeepPlaying?: () => void;
}

function GameOverlayComponent({
  type,
  score,
  onRestart,
  onKeepPlaying,
}: GameOverlayProps): React.ReactElement {
  const isGameOver = type === 'gameOver';

  return (
    <div className="absolute inset-0 bg-tile-2/90 flex flex-col items-center justify-center rounded-lg z-10">
      <div className="text-5xl font-bold text-text-dark mb-4">
        {isGameOver ? 'Game Over!' : 'You Won!'}
      </div>

      {isGameOver && (
        <div className="text-2xl text-text-dark mb-6">
          Score: <span className="font-bold">{score}</span>
        </div>
      )}

      <div className="flex gap-4">
        {onKeepPlaying && !isGameOver && (
          <button
            onClick={onKeepPlaying}
            className="px-6 py-3 bg-tile-8 text-text-light rounded-lg font-bold text-lg hover:bg-tile-16 transition-colors"
          >
            Keep Playing
          </button>
        )}
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-tile-128 text-text-light rounded-lg font-bold text-lg hover:bg-tile-256 transition-colors"
        >
          {isGameOver ? 'Try Again' : 'New Game'}
        </button>
      </div>
    </div>
  );
}

export const GameOverlay = React.memo(GameOverlayComponent);
