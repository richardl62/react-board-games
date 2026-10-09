import { MatchControls } from './match-controls';
import { RematchControlsProps, RematchGameControl, RematchProposal } from './rematch-controls';
import { RestartMatchButton } from './restart-match-button';

// The sets of match controls (see MatchControls) used by the different types of match.

// Controls for a match where a rematch must be proposed and then accepted by all
// players (e.g. an online match).
export function rematchMatchControls(props: RematchControlsProps): MatchControls {
  return {
    notices: <RematchProposal {...props} />,
    controls: <RematchGameControl {...props} />,
  };
}

// Controls for a match with a single local user (e.g. offline pass-and-play), where
// there is no need for a rematch to be proposed and accepted.
export function restartMatchControls(restart: () => void): MatchControls {
  return {
    notices: <></>,
    controls: <RestartMatchButton restart={restart} />,
  };
}
