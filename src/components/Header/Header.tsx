import React from 'react';
import { NewGameButton } from './NewGameButton';
import { UndoButton } from './UndoButton';

interface HeaderProps {
  onNewGame: () => void;
  onUndo: () => void;
  canUndo?: boolean;
}

function HeaderComponent({ onNewGame, onUndo, canUndo }: HeaderProps): React.ReactElement {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-5xl font-bold text-text-dark">2048</h1>
      <div className="flex gap-2">
        <UndoButton onClick={onUndo} disabled={!canUndo} />
        <NewGameButton onClick={onNewGame} />
      </div>
    </div>
  );
}

export const Header = React.memo(HeaderComponent);
