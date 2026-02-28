import React from 'react';

interface NewGameButtonProps {
  onClick: () => void;
}

function NewGameButtonComponent({ onClick }: NewGameButtonProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className="bg-tile-8 text-text-light font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
    >
      New Game
    </button>
  );
}

export const NewGameButton = React.memo(NewGameButtonComponent);
