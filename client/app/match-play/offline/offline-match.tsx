import { AppGame } from '@/app-game-support/app-game';
import { JSX } from 'react';
import styled from 'styled-components';
import { OfflineOptions } from '../../offline-options';
import { GameBoardWrapper } from '../game-board-wrapper';
import { Ctx } from '@shared/game-control/ctx';
import { makePlayerActions } from './make-player-actions';
import { useOfflineMatchState } from './use-offline-match-state';
import { MatchWithControls } from '../match-controls';
import { rematchMatchControls, restartMatchControls } from '../match-control-sets';

const OptionalDisplay = styled.div<{ display_: boolean }>`
  display: ${(props) => (props.display_ ? 'block' : 'none')};
`;

// This together with onlineMatch are the entry points used to start a match.
export function OfflineMatch({
  game,
  options,
}: {
  game: AppGame;
  options: OfflineOptions;
}): JSX.Element {
  const { passAndPlay } = options;
  const { matchState, setMatchState, restart, sendRematchRequest } = useOfflineMatchState(
    game,
    options,
  );

  const ctx = new Ctx(matchState.ctxData);

  const boards: JSX.Element[] = [];
  for (const viewingPlayer of ctx.playOrder) {
    const { moves, events } = makePlayerActions(game, viewingPlayer, matchState, setMatchState);

    // Create a board that is optionally displayed. (Early code created either a board
    // or a blank element. However, this caused the Scrabble dictionary to be reloaded
    // on each move. Presumably, this was because the compoment was unloaded and reloaded
    // each time.)
    const board = (
      <GameBoardWrapper
        game={game}
        viewingPlayer={viewingPlayer}
        connectionStatus={'connected'}
        matchState={matchState}
        actionRequestStatus={{
          waitingForServer: false,
          lastActionUnconfirmed: false,
          predictionDiverged: false,
        }}
        moves={moves}
        events={events}
      />
    );

    const show = !passAndPlay || viewingPlayer === ctx.currentPlayer;
    boards.push(
      <OptionalDisplay key={viewingPlayer} display_={show}>
        {passAndPlay ? (
          board
        ) : (
          // Without pass-and-play (intended for testing) each player's board is shown
          // as it would be in an online match.
          <MatchWithControls
            matchControls={rematchMatchControls({
              playerData: matchState.playerData,
              playerID: viewingPlayer,
              sendRematchRequest: (request) => sendRematchRequest(viewingPlayer, request),
            })}
          >
            {board}
          </MatchWithControls>
        )}
      </OptionalDisplay>,
    );
  }

  if (passAndPlay) {
    // A single set of controls (rather than one per board) so that, for example,
    // whether the controls are shown does not change when the turn passes.
    return (
      <MatchWithControls matchControls={restartMatchControls(restart)}>
        <div>{boards}</div>
      </MatchWithControls>
    );
  }

  return <div>{boards}</div>;
}
