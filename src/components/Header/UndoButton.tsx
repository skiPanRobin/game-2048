import React from 'react';

interface UndoButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

function UndoButtonComponent({ onClick, disabled }: UndoButtonProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-tile-64 text-text-light hover:bg-tile-128'
      }`}
    >
      Undo
    </button>
  );
}

export const UndoButton = React.memo(UndoButtonComponent);
