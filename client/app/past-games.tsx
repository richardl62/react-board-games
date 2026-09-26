import { AppGame } from '@/app-game-support/app-game';
import { nonJoinedPlayerName } from '@/app-game-support/player-status';
import { standardOuterMargin } from '@/app-game-support/styles';
import { archivedMatchSearch } from '@/url-tools';
import { AsyncStatus } from '@utils/async-status';
import {
  ArchivedMatchSummary,
  ArchiveGameVersion,
  countOtherVersionMatches,
  listArchivedMatches,
} from '@utils/match-archive';
import { sAssert } from '@shared/utils/assert';
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

const UnlistedStyles = styled.div`
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`;

function formatDate(date: Date): string {
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function MatchRow({ match, games }: { match: ArchivedMatchSummary; games: AppGame[] }) {
  // Only matches of current (and so recognised) games are listed.
  const game = games.find((g) => g.name === match.game);
  sAssert(game, `Unrecognised game "${match.game}" in list of past games`);

  return (
    <tr>
      <td>
        <Link to={{ pathname: gamePath(game), search: archivedMatchSearch(match.id) }}>
          {game.displayName}
        </Link>
      </td>
      <td>{match.players.map((name) => name ?? nonJoinedPlayerName).join(', ')}</td>
      <td>{formatDate(match.createdAt)}</td>
      <td>{formatDate(match.updatedAt)}</td>
    </tr>
  );
}

function MatchTable({ matches, games }: { matches: ArchivedMatchSummary[]; games: AppGame[] }) {
  if (matches.length === 0) {
    return <div>No saved games to display.</div>;
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

// Report matches that are not listed because they can't be displayed.
function UnlistedMatches({ count }: { count: number }) {
  if (count === 0) {
    return null;
  }

  const games = count === 1 ? '1 saved game has' : `${count} saved games have`;
  return <UnlistedStyles>{games} an unsupported version and cannot be displayed.</UnlistedStyles>;
}

// The current archive versions of those games that are archived.
function currentArchiveVersions(games: AppGame[]): ArchiveGameVersion[] {
  const versions: ArchiveGameVersion[] = [];
  for (const { name, archive } of games) {
    if (archive) {
      versions.push({ game: name, version: archive.version });
    }
  }
  return versions;
}

// Lists recent matches from the online match archive, with links to review them.
// Matches that can't be displayed (because they were saved by a different
// version of the game) are counted rather than listed.
export function PastGamesPage({ games }: { games: AppGame[] }): JSX.Element {
  const asyncMatches = useAsync(() => {
    const currentVersions = currentArchiveVersions(games);
    return Promise.all([
      listArchivedMatches(currentVersions),
      countOtherVersionMatches(currentVersions),
    ]);
  }, [games]);

  const result = asyncMatches.result;

  return (
    <PageStyles>
      <h1>Past Games</h1>
      {result ? (
        <>
          <MatchTable matches={result[0]} games={games} />
          <UnlistedMatches count={result[1]} />
        </>
      ) : (
        <AsyncStatus status={asyncMatches} activity="loading past games" />
      )}
      <Link to="/">Home</Link>
    </PageStyles>
  );
}
