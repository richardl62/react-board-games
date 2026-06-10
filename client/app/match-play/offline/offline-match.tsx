import { AppGame } from '@/app-game-support/app-game';
import { JSX, useState } from 'react';
import styled from 'styled-components';
import { OfflineOptions } from '../../offline-options';
import { GameBoardWrapper } from '../game-board-wrapper';
import { makeInitialMatchState } from './make-initial-match-data';
import { Ctx } from '@shared/game-control/ctx';
import { makePlayerActions } from './make-player-actions';
import { useSearchParamData } from '@/url-tools';

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
  const { numPlayers, passAndPlay, setupData } = options;
  const { seed: seedParam } = useSearchParamData();

  const [matchState, setMatchState] = useState(() =>
    makeInitialMatchState(game, numPlayers, seedParam ?? Math.random(), setupData),
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
          lastActionIgnored: false,
          lastActionUnconfirmed: false,
        }}
        moves={moves}
        events={events}
      />
    );

    const show = !passAndPlay || viewingPlayer === ctx.currentPlayer;
    boards.push(
      <OptionalDisplay key={viewingPlayer} display_={show}>
        {board}
      </OptionalDisplay>,
    );
  }

  return <div>{boards}</div>;
}
