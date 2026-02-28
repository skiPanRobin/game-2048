import React from 'react';

function FooterComponent(): React.ReactElement {
  return (
    <div className="mt-6 text-center text-text-dark text-sm">
      <p>Use <span className="font-bold">arrow keys</span> to move tiles</p>
    </div>
  );
}

export const Footer = React.memo(FooterComponent);
