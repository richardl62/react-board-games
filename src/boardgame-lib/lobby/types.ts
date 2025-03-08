/* eslint-disable tsdoc/syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface PlayerMetadata  {
    id: number;
    name?: string;
    credentials?: string;
    isConnected?: boolean;
}

type PublicPlayerMetadata = Omit<PlayerMetadata, "credentials">;

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


