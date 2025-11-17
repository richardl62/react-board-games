import { MatchList, Match, CreatedMatch, JoinedMatch } from "./types.js";

export interface LobbyInterface {

    listMatches: (
        options: {
            gameName: string;
        }
    ) => MatchList;
    
    getMatch: (
        options: {
            gameName: string;
            matchID: string;
        }
    ) => Match;
    
    createMatch: (
        options: {
            gameName: string;
            numPlayers: number;
            setupData: unknown;
        }
    ) => CreatedMatch;

    joinMatch: (
        options: {
            matchID: string;
            playerName: string;
        }
    ) => JoinedMatch;

    updatePlayer: (
        options: {
            matchID: string;
            playerID: string;
            credentials: string;
            newName: string;
        }
    ) => void;
}
