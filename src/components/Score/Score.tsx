import React from 'react';

interface ScoreProps {
  score: number;
  bestScore: number;
}

function ScoreComponent({ score, bestScore }: ScoreProps): React.ReactElement {
  return (
    <div className="flex gap-4">
      <div className="bg-game-container rounded-md px-4 py-2 text-center min-w-[100px]">
        <div className="text-xs uppercase text-text-light font-bold tracking-wider">Score</div>
        <div className="text-xl font-bold text-text-light">{score}</div>
      </div>
      <div className="bg-game-container rounded-md px-4 py-2 text-center min-w-[100px]">
        <div className="text-xs uppercase text-text-light font-bold tracking-wider">Best</div>
        <div className="text-xl font-bold text-text-light">{bestScore}</div>
      </div>
    </div>
  );
}

export const Score = React.memo(ScoreComponent);
