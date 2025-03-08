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
