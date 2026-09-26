import { AppGame } from '@/app-game-support/app-game';
import { UntypedMoves } from '@/app-game-support/board-props';
import { ArchivedMatch as ArchivedMatchData, fetchArchivedMatch } from '@utils/match-archive';
import { AsyncStatus } from '@utils/async-status';
import { Ctx } from '@shared/game-control/ctx';
import { EventsAPI } from '@shared/game-control/events';
import { JSX } from 'react';
import { useAsync } from 'react-async-hook';
import styled from 'styled-components';
import { ActionRequestStatus, GameBoardWrapper } from '../game-board-wrapper';
import { archiveVersionStatus } from './archive-version';

const Banner = styled.div`
  margin-left: 1.5em;
  margin-bottom: 0.5em;

  > *:first-child {
    font-weight: bold;
    margin-right: 0.5em;
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

  const recordedDate = updatedAt.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div>
      <Banner>
        <span>Saved game</span>
        <span>(Recorded {recordedDate})</span>
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

  const problem = versionProblem(game, archived.archiveVersion);
  if (problem) {
    return <div>{problem}</div>;
  }

  return <ArchivedMatchBoard game={game} archived={archived} />;
}

// Return a message explaining why a match saved with the given archive version
// cannot be displayed, or null if it can be.
function versionProblem(game: AppGame, savedVersion: number): string | null {
  const { archive, displayName } = game;
  const currentVersion = archive ? archive.version : null;

  switch (archiveVersionStatus(game, savedVersion)) {
    case 'current':
      return null;
    case 'notArchived':
      return `${displayName} games are no longer saved, so this saved game cannot be displayed.`;
    case 'older':
      return (
        `This game was saved by an older version of ${displayName} ` +
        `(archive version ${savedVersion}, current version ${currentVersion}) ` +
        'and can no longer be displayed.'
      );
    case 'newer':
      return (
        `This game was saved by a newer version of ${displayName} ` +
        `(archive version ${savedVersion}, this page has version ${currentVersion}). ` +
        'Try reloading the page.'
      );
  }
}
