import { AppGame } from '@/app-game-support/app-game';
import { nonJoinedPlayerName } from '@/app-game-support/player-status';
import { standardOuterMargin } from '@/app-game-support/styles';
import { archivedMatchSearch } from '@/url-tools';
import { AsyncStatus } from '@utils/async-status';
import { ArchivedMatchSummary, listArchivedMatches } from '@utils/match-archive';
import { JSX } from 'react';
import { useAsync } from 'react-async-hook';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { gamePath } from './app-paths';

const PageStyles = styled.div`
  font-size: 18px;
  margin: ${standardOuterMargin};

  h1 {
    font-size: 1.2em;
    font-weight: bold;
  }

  table {
    border-collapse: collapse;
    margin: 0.5em 0;
  }

  th,
  td {
    text-align: left;
    padding: 0.2em 1em 0.2em 0;
  }
`;

function formatDate(date: Date): string {
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function MatchRow({ match, games }: { match: ArchivedMatchSummary; games: AppGame[] }) {
  const game = games.find((g) => g.name === match.game);

  // An unrecognised game can occur if a game has been renamed or removed
  // since the match was saved.
  const gameCell = game ? (
    <Link to={{ pathname: gamePath(game), search: archivedMatchSearch(match.id) }}>
      {game.displayName}
    </Link>
  ) : (
    `${match.game} (unrecognised game)`
  );

  return (
    <tr>
      <td>{gameCell}</td>
      <td>{match.players.map((name) => name ?? nonJoinedPlayerName).join(', ')}</td>
      <td>{formatDate(match.createdAt)}</td>
      <td>{formatDate(match.updatedAt)}</td>
    </tr>
  );
}

function MatchTable({ matches, games }: { matches: ArchivedMatchSummary[]; games: AppGame[] }) {
  if (matches.length === 0) {
    return <div>No saved games yet.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Game</th>
          <th>Players</th>
          <th>Started</th>
          <th>Last move</th>
        </tr>
      </thead>
      <tbody>
        {matches.map((match) => (
          <MatchRow key={match.id} match={match} games={games} />
        ))}
      </tbody>
    </table>
  );
}

// Lists recent matches from the online match archive, with links to review them.
export function PastGamesPage({ games }: { games: AppGame[] }): JSX.Element {
  const asyncMatches = useAsync(listArchivedMatches, []);
  const matches = asyncMatches.result;

  return (
    <PageStyles>
      <h1>Past Games</h1>
      {matches ? (
        <MatchTable matches={matches} games={games} />
      ) : (
        <AsyncStatus status={asyncMatches} activity="loading past games" />
      )}
      <Link to="/">Home</Link>
    </PageStyles>
  );
}
