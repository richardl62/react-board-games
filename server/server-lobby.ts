import { Matches } from "./matches.js";
import { LobbyInterface } from "../shared/lobby/interface.js";
import * as LobbyTypes from "../shared/lobby/types.js";

export class ServerLobby implements LobbyInterface {
    constructor(matches: Matches) {
        this.matches = matches;
    }
    matches: Matches;

    createMatch(
        {gameName, numPlayers, setupData}: {
            gameName: string;
            numPlayers: number;
            setupData: unknown;
        }
    ): LobbyTypes.CreatedMatch {   
        const match = this.matches.addMatch(gameName, numPlayers, setupData);
        return match.lobbyMatch();
    }

    listMatches(
        {gameName} : {gameName: string}
    ): LobbyTypes.MatchList {
        const matches = this.matches.getMatches(gameName);

        return {
            matches: matches.map(m => m.lobbyMatch())
        }
    }

    getMatch(
        { gameName, matchID } : {
            gameName: string, // Is this helpful?
            matchID: string,
        }
    ): LobbyTypes.Match {
        const match = this.matches.getMatch(parseInt(matchID));
        if ( match.gameName !== gameName ) {
            throw new Error("selected match is not of the expected game");
        }

        return match.lobbyMatch();
    }

    joinMatch(
        { matchID, playerName } : {
            gameName: string,
            matchID: string,
            playerName: string;
        }
    ): LobbyTypes.JoinedMatch {
        const match = this.matches.getMatch(parseInt(matchID));

        const player = match.allocatePlayer(playerName);

        return { playerID: player.id.toString(), playerCredentials: player.credentials}
    }

    updatePlayer( 
         { matchID, playerID, newName } : {
            gameName: string,
            matchID: string,

            playerID: string;
            credentials: string;
            newName: string;
        }
    ) : null {
        const match = this.matches.getMatch(parseInt(matchID));

        const player = match.findPlayerByID(playerID);
        if( !player ) {
            throw new Error("cannot find player to update");
        }

        player.changeName(newName);
        return null;
    }
} 