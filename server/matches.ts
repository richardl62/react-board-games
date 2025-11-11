import { WebSocket } from 'ws';
import { GameControl } from "../shared/game-control/game-control.js";
import { allGames } from "../shared/game-control/games/all-games.js";
import { Match } from "./match.js";

// Matches is intended as a fairly simple wrapper around a collection of matches.
export class Matches {
    private matches: Match[];
    
    constructor() {
        this.matches = [];
    }

    /** Create a new match and return it's ID */
    addMatch(game: string, numPlayers: number, setupData: unknown) : Match
    {
        // Base the id on the number of recorded matches.  This feels like
        // a bit of a kludge, but should ensure a unique id.
        const id = this.matches.length+1; 

        const match = new Match(getGameControl(game), {id, numPlayers, setupData});
        this.matches.push(match);

        return match;
    }
    
    getMatch(matchID: number) : Match
    {
        for( const match of this.matches) {
            if (match.id === matchID) {
                return match;
            }
        }

        throw new Error(`Invalid Match ID: ${matchID}`);
    }

    /** Get all the matches of a particular game (e.g. Scrabble) */
    getMatches(gameName: string) : Match[]
    {
        const matches: Match[] = [];
        for( const match of this.matches) {
            if ( match.gameName === gameName ) {
                matches.push(match);
            }
        }

        return matches;
    }

    // Get the match that a player is in
    getMatchByWebSocket(ws: WebSocket) : Match | null {
        for (const match of this.matches) {
            if (match.findPlayerByWebSocket(ws)) {
                return match;
            }
        }
        
        return null;
    }
} 

function getGameControl(name: string): GameControl {
    for(const gc of allGames) {
      if(gc.name === name) {
        return gc;
      }
    } 
    
    throw new Error(`Unrecognised game "${name}"`)
}
