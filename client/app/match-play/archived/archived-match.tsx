import { AppGame } from '@/app-game-support/app-game';
import { UntypedMoves } from '@/app-game-support/board-props';
import { pastGamesPath } from '@/app/app-paths';
import { ArchivedMatch as ArchivedMatchData, fetchArchivedMatch } from '@utils/match-archive';
import { AsyncStatus } from '@utils/async-status';
import { Ctx } from '@shared/game-control/ctx';
import { EventsAPI } from '@shared/game-control/events';
import { JSX } from 'react';
import { useAsync } from 'react-async-hook';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ActionRequestStatus, GameBoardWrapper } from '../game-board-wrapper';

const Banner = styled.div`
  margin: 0.25em 0.5em 0.5em;

  > *:not(:first-child) {
    margin-left: 1em;
  }
`;

const actionRequestStatus: ActionRequestStatus = {
  waitingForServer: false,
  lastActionUnconfirmed: false,
  predictionDiverged: false,
};

function disabledAction(): never {
  throw new Error('This is a saved game: moves are not allowed');
}

// Moves and events that throw if used.
function makeDisabledActions(game: AppGame): { moves: UntypedMoves; events: EventsAPI } {
  const moves: UntypedMoves = {};
  for (const moveName in game.moves) {
    moves[moveName] = disabledAction;
  }

  return { moves, events: { endTurn: disabledAction, endMatch: disabledAction } };
}

function ArchivedMatchBoard({
  game,
  archived,
}: {
  game: AppGame;
  archived: ArchivedMatchData;
}): JSX.Element {
  const { matchState, updatedAt } = archived;

  // Reviewers see the match as the first player would.
  const viewingPlayer = new Ctx(matchState.ctxData).playOrder[0];
  const { moves, events } = makeDisabledActions(game);

  return (
    <div>
      <Banner>
        <span>Saved game - last updated {updatedAt.toLocaleString()}</span>
        <Link to={pastGamesPath}>Past games</Link>
      </Banner>
      <GameBoardWrapper
        game={game}
        viewingPlayer={viewingPlayer}
        connectionStatus={'connected'}
        matchState={matchState}
        actionRequestStatus={actionRequestStatus}
        moves={moves}
        events={events}
      />
    </div>
  );
}

// Entry point used to review a match saved in the online archive.
// (c.f. OfflineMatch and OnlineMatch)
export function ArchivedMatch({
  game,
  archiveID,
}: {
  game: AppGame;
  archiveID: string;
}): JSX.Element {
  const asyncMatch = useAsync(() => fetchArchivedMatch(archiveID), [archiveID]);
  const archived = asyncMatch.result;

  if (!archived) {
    return <AsyncStatus status={asyncMatch} activity="loading saved game" />;
  }

  if (archived.game !== game.name) {
    return (
      <div>
        Error: This saved game is of {archived.game}, not {game.name}
      </div>
    );
  }

  return <ArchivedMatchBoard game={game} archived={archived} />;
}
