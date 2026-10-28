import { WebSocket } from 'ws';
import { GameControl } from '../shared/game-control/game-control.js';
import { allGames } from '../shared/game-control/games/all-games.js';
import { Match } from './match.js';
import { RandomAPI } from '../shared/utils/random-api.js';
import { Player } from './player.js';
import { MatchOptions } from '../shared/match-options.js';
import { createAlphanumericString } from '../shared/utils/random-string.js';
import { sAssert } from '../shared/utils/assert.js';

// Matches is intended as a fairly simple wrapper around a collection of matches.
export class Matches {
  private matches: Match[];

  constructor() {
    this.matches = [];
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
