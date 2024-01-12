/*
    STUB definitions - just enough to get the code to compile.
*/

type PublicPlayerMetadata = {
    name:string,
    isConnected:boolean,
};

interface MatchInfo {
    players: PublicPlayerMetadata[],
    matchID: string,
}

// Use namespace for now, to simplify the transition to a new API.
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace LobbyAPI {
    export type GameList = string[];
    // type PublicPlayerMetadata = Omit<Server.PlayerMetadata, 'credentials'>;
    export type Match = {
        matchID: string;
        players: PublicPlayerMetadata[];
    };
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

export class LobbyClient{
    constructor(private readonly options: { server: string }) {
    }

    createMatch(_arg0: unknown, _arg1: unknown): Promise<LobbyAPI.CreatedMatch> {
        throw new Error("createMatch method not implemented.");
    }

    getMatch(_arg0: unknown, _arg1: unknown): Promise<MatchInfo> {
        throw new Error("createMatch method not implemented.");
    }

    listMatches(_arg0: unknown): Promise<LobbyAPI.MatchList> {
        throw new Error("createMatch method not implemented.");
    }

    joinMatch(_arg0: unknown, _arg1: unknown, _arg3: unknown): Promise<LobbyAPI.JoinedMatch> {
        throw new Error("createMatch method not implemented.");
    }


    updatePlayer(_arg0: unknown, _arg1: unknown, _arg3: unknown): Promise<unknown> {
        throw new Error("createMatch method not implemented.");
    }
}