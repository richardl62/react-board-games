import { JSX } from 'react';

// Button to restart the match immediately (after confirmation), as for a new match.
export function RestartMatchButton({ restart }: { restart: () => void }): JSX.Element {
  const onClick = () => {
    if (window.confirm('Restart the match?')) {
      restart();
    }
  };
  return <button onClick={onClick}>Restart Match</button>;
}
