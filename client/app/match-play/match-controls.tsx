import { JSX, ReactNode } from 'react';
import { GameControls } from './game-controls';

// Match-level controls (as opposed to moves), e.g. rematch. Built by the match type
// (online/offline) so that match components need not know which controls exist.
export interface MatchControls {
  // Shown above the board and always visible. May render nothing.
  notices: JSX.Element;

  // Shown below the board, behind the 'Show game controls' checkbox. Should always
  // render something, so that ticking the checkbox always has a visible effect.
  controls: JSX.Element;
}

// Lays out a board (or set of boards) with its notices and game controls.
export function MatchWithControls({
  matchControls,
  children,
}: {
  matchControls: MatchControls;
  children: ReactNode;
}): JSX.Element {
  const { notices, controls } = matchControls;
  return (
    <div>
      {notices}
      {children}
      <GameControls>{controls}</GameControls>
    </div>
  );
}
