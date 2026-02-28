import React from 'react';
import { useGame } from '../context/GameContext';
import { useSwipe } from '../hooks/useSwipe';
import { Grid } from './Grid';
import { GameOverlay } from './GameOverlay/GameOverlay';

function GameBoardComponent(): React.ReactElement {
  const { grid, gameOver, gameWon, score, reset, keepPlaying, move } = useGame();

  useSwipe({ onSwipe: move });

  return (
    <div className="flex items-center justify-center relative">
      <Grid grid={grid} />
      {(gameOver || gameWon) && (
        <GameOverlay
          type={gameOver ? 'gameOver' : 'gameWon'}
          score={score}
          onRestart={reset}
          onKeepPlaying={gameWon ? keepPlaying : undefined}
        />
      )}
    </div>
  );
}

export const GameBoard = React.memo(GameBoardComponent);
