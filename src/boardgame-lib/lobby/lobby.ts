/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable tsdoc/syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */

import { LobbyClient as BgioLobbyClient} from "boardgame.io/client";

interface PlayerMetadata  {
    id: number;
    name?: string;
    credentials?: string;
    isConnected?: boolean;
}
type PublicPlayerMetadata = Omit<PlayerMetadata, "credentials">;

interface MatchData {
    gameName: string;
    players: {
        [id: number]: PlayerMetadata;
    };
    setupData?: any;
    gameover?: any;
}

export declare namespace LobbyAPI {
    export type GameList = string[];

    export interface Match {
        gameName: string;
        matchID: string;
        players: PublicPlayerMetadata[];
        setupData?: any;
        gameover?: any;
    }

    export interface MatchList {
        matches: Match[];
    }
    export interface CreatedMatch {
        matchID: string;
    }
    export interface JoinedMatch {
        playerID: string;
        playerCredentials: string;
    }
    export interface NextMatch {
        nextMatchID: string;
    }
    export {};
}

export class LobbyClient {
    bgioLobbyClient: BgioLobbyClient;
    constructor({ server }: {
        server?: string;
    }) {
        this.bgioLobbyClient = new BgioLobbyClient({ server });
    }

    listMatches(gameName: string): Promise<LobbyAPI.MatchList> {
        return this.bgioLobbyClient.listMatches(gameName);
    }

    /**
     * Get metadata for a specific match.
     * @param  gameName The match’s game type, e.g. 'tic-tac-toe'.
     * @param  matchID  Match ID for the match to fetch.
     */
    getMatch(gameName: string, matchID: string): Promise<LobbyAPI.Match>
    {
        return this.bgioLobbyClient.getMatch(gameName, matchID);
    }

    /**
     * Create a new match for a specific game type.
     * @param  gameName The game to create a match for, e.g. 'tic-tac-toe'.
     * @param  body     Options required to configure match creation.
     */
    createMatch(gameName: string, body: {
        numPlayers: number;
        setupData?: any;
    }): Promise<LobbyAPI.CreatedMatch> {
        return this.bgioLobbyClient.createMatch(gameName, body); 
    }
    /**
     * Join a match using its matchID.
     * @param  gameName The match’s game type, e.g. 'tic-tac-toe'.
     * @param  matchID  Match ID for the match to join.
     * @param  body     Options required to join match.
     */
    joinMatch(gameName: string, matchID: string, body: {
        playerID?: string;
        playerName: string;
    }): Promise<LobbyAPI.JoinedMatch> {
        return this.bgioLobbyClient.joinMatch(gameName, matchID, body);
    }

    /**
     * Update a player’s name or custom metadata.
     * @param  gameName The match’s game type, e.g. 'tic-tac-toe'.
     * @param  matchID  Match ID for the match to update.
     * @param  body     Options required to update player.
     */
    updatePlayer(gameName: string, matchID: string, body: {
        playerID: string;
        credentials: string;
        newName?: string;
    }): Promise<void> {
        return this.bgioLobbyClient.updatePlayer(gameName, matchID, body);
    }
}

