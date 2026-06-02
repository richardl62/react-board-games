import { WebSocket } from 'ws';
import { GameControl } from '../shared/game-control/game-control.js';
import { allGames } from '../shared/game-control/games/all-games.js';
import { Match } from './match.js';
import { RandomAPI } from '../shared/utils/random-api.js';
import { Player } from './player.js';

// Matches is intended as a fairly simple wrapper around a collection of matches.
export class Matches {
  private matches: Match[];

  constructor() {
    this.matches = [];
  }

  /** Create a new match and return it's ID */
  addMatch(game: string, numPlayers: number, setupData: unknown, randomSeed: number): Match {
    // Base the id on the number of recorded matches.  This feels like
    // a bit of a kludge, but should ensure a unique id.
    const matchID = (this.matches.length + 1).toString();

    const match = new Match(getGameControl(game), {
      matchID,
      numPlayers,
      setupData,
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
