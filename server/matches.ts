import { WebSocket } from 'ws';
import { Match } from "./match.js";
import { GameControl } from "../shared/game-control/game-control.js";
import { allGames } from "../shared/game-control/games/all-games.js";


// The Match interface is intended to be convenient for internal use.
// (ServerLobby uses Match to help respond to client request.)
export class Matches {
    constructor() {
        this.matches = [];
    }

    private matches: Match[];

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

        throw new Error("Invalid Match ID");
    }

    /** Get all the matchs of a particular game (e.g. Scrabble) */
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

    makeMove(_ws: WebSocket, _parameterStr: string) : void {
        throw new Error('makeMove not implemented');
        // const match = this.getMatchByWebSocket(ws);
        // if (!match) {
        //     throw new Error('Player not in a match');
        // }
        // const moveData: ServerMoveData = JSON.parse(parameterStr);
        // const { activePlayer, arg } = moveData;
        // if ( typeof activePlayer !== "number" ) {
        //     throw new Error('bad parameter string in makeMove');
        // }

        // match.move(moveData.move, activePlayer, arg);
    }

    playerDisconnected(ws: WebSocket) : void {
        const match = this.getMatchByWebSocket(ws);
        if (!match) {
           throw new Error('Player not in a match');
        } else {
            match.disconnectPlayer(ws);
        }
    }

    // Get the match that a player is in
    private getMatchByWebSocket(ws: WebSocket) : Match | null {
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