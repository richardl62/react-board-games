import { GameControl } from '@shared/game-control/game-control';
import { ArchiveGameVersion } from '@utils/match-archive';

// How the archive version of a saved match compares to the current version of its
// game. Only 'current' matches can be displayed.
//   'notArchived': The game is not (or is no longer) archived, or is not recognised.
export type ArchiveVersionStatus = 'current' | 'older' | 'newer' | 'notArchived';

export function archiveVersionStatus(
  game: GameControl | undefined,
  savedVersion: number,
): ArchiveVersionStatus {
  if (!game?.archive) {
    return 'notArchived';
  }

  if (savedVersion < game.archive.version) {
    return 'older';
  }

  if (savedVersion > game.archive.version) {
    return 'newer';
  }

  return 'current';
}

// The current archive versions of those games that are archived.
export function currentArchiveVersions(games: GameControl[]): ArchiveGameVersion[] {
  const versions: ArchiveGameVersion[] = [];
  for (const { name, archive } of games) {
    if (archive) {
      versions.push({ game: name, version: archive.version });
    }
  }
  return versions;
}
