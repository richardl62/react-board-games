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
        const match = this.matches.findMatch(matchID);
        if (!match) {
            throw new Error(`Match ${matchID} not found`);
        }

        if ( match.gameName !== gameName ) {
            throw new Error("selected match is not of the expected game");
        }

        return match.lobbyMatch();
    }

    joinMatch(
        { matchID, playerName } : {
            matchID: string,
            playerName: string;
        }
    ): LobbyTypes.JoinedMatch {
        const match = this.matches.findMatch(matchID);
        if (!match) {
            throw new Error(`Match ${matchID} not found`);
        }

        const player = match.allocatePlayer(playerName);

        return { playerID: player.id.toString(), playerCredentials: player.credentials}
    }

    updatePlayer( 
         { matchID, playerID, credentials, newName } : {
            matchID: string,
            playerID: string;
            credentials: string;
            newName: string;
        }
    ) : null {
        const match = this.matches.findMatch(matchID);
        if (!match) {
            throw new Error(`Match ${matchID} not found`);
        }

        const player = match.findPlayer({id: playerID});
        if( !player ) {
            throw new Error("cannot find player to update");
        }
        
        if( player.credentials !== credentials ) {
            throw new Error("invalid credentials for player update");
        }

        if ( match.findPlayer({ name: newName }) ) {
            throw new Error(`player name "${newName}" already in use`);
        }

        player.changeName(newName);
        return null;
    }
} 