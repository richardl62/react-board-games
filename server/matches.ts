import { WebSocket } from 'ws';
import { GameControl } from '../shared/game-control/game-control.js';
import { allGames } from '../shared/game-control/games/all-games.js';
import { Match } from './match.js';
import { RandomAPI } from '../shared/utils/random-api.js';
import { Player } from './player.js';
import { MatchOptions } from '../shared/match-options.js';
import { createAlphanumericString } from '../shared/utils/random-string.js';
import { sAssert } from '../shared/utils/assert.js';
import { loadLiveMatch } from './live-matches.js';
import { isSupabaseEnabled } from './supabase.js';

// Matches is intended as a fairly simple wrapper around a collection of matches.
export class Matches {
  private matches: Match[];

  // Loads (from the saved live matches) that are in progress, keyed by match ID.
  private loading = new Map<string, Promise<void>>();

  constructor() {
    this.matches = [];
  }

  /** If the match is not in memory, restore it from the saved live matches (e.g.
   * after a server restart). Concurrent calls for the same match share one load.
   * If there is no usable saved match, this resolves but the match remains unknown.
   * Rejects if the saved matches cannot be read. */
  async ensureLoaded(matchID: string): Promise<void> {
    if (this.findMatch(matchID) || !isSupabaseEnabled) {
      return;
    }

    let load = this.loading.get(matchID);
    if (!load) {
      load = this.load(matchID).finally(() => this.loading.delete(matchID));
      this.loading.set(matchID, load);
    }
    await load;
  }

  private async load(matchID: string): Promise<void> {
    const record = await loadLiveMatch(matchID);
    if (!record) {
      return;
    }

    // A saved match can't be restored if its game has since been removed, or has
    // changed in a way that makes the saved state unusable.
    const gameControl = allGames.find((gc) => gc.name === record.game);
    if (!gameControl) {
      console.warn(`Cannot restore match ${matchID}: unrecognised game "${record.game}"`);
      return;
    }
    if (record.stateVersion !== gameControl.stateVersion) {
      console.warn(
        `Cannot restore match ${matchID}: saved with state version ${record.stateVersion}, ` +
          `but ${record.game} is now version ${gameControl.stateVersion}`,
      );
      return;
    }

    sAssert(!this.findMatch(matchID), `Match ${matchID} unexpectedly already loaded`);
    this.matches.push(new Match(gameControl, { matchID, saved: record.data }));
    console.log(`Restored match ${matchID} (${record.game})`);
  }

  /** Create a new match and return it's ID */
  addMatch(
    game: string,
    numPlayers: number,
    setupData: unknown,
    matchOptions: MatchOptions,
    randomSeed: number,
  ): Match {
    // A random ID, so that it is unique across server restarts (and so that links to
    // a match remain valid if the match is restored after a restart). 10 characters
    // make a collision vanishingly unlikely.
    const matchID = createAlphanumericString(10);
    sAssert(!this.findMatch(matchID), `Duplicate match ID ${matchID}`);

    const match = new Match(getGameControl(game), {
      matchID,
      numPlayers,
      setupData,
      matchOptions,
      randomAPI: RandomAPI.fromSeed(randomSeed),
    });
    this.matches.push(match);

    return match;
  }

  /** Resolves when all saves requested so far, for all matches, have completed */
  async allSavesCompleted(): Promise<void> {
    await Promise.all(this.matches.map((m) => m.savesCompleted));
  }

  findMatch(matchID: string): Match | undefined {
    return this.matches.find((m) => m.matchID === matchID);
  }

  /** Get all the matches of a particular game (e.g. Scrabble) */
  getMatches(gameName: string): Match[] {
    return this.matches.filter((m) => m.gameName === gameName);
  }

  findMatchAndPlayer(ws: WebSocket): { match: Match; player: Player } | null {
    for (const match of this.matches) {
      const player = match.findPlayer({ ws });
      if (player) {
        return { match, player };
      }
    }

    return null;
  }
}

function getGameControl(name: string): GameControl {
  for (const gc of allGames) {
    if (gc.name === name) {
      return gc;
    }
  }

  throw new Error(`Unrecognised game "${name}"`);
}
