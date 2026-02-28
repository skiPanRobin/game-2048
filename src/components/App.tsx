import React from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import { Header } from './Header/Header';
import { Score } from './Score/Score';
import { GameBoard } from './GameBoard';
import { Footer } from './Footer/Footer';

function AppContent(): React.ReactElement {
  const { score, bestScore, reset, undo, history } = useGame();

  return (
    <div className="min-h-screen bg-game-bg flex flex-col items-center justify-center p-4">
      <Header onNewGame={reset} onUndo={undo} canUndo={history.length > 0} />
      <Score score={score} bestScore={bestScore} />
      <GameBoard />
      <Footer />
    </div>
  );
}

function AppComponent(): React.ReactElement {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export { AppComponent as App };
