import { MatchList, Match, CreatedMatch, JoinedMatch } from "./types";

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
            gameName: string;
            matchID: string;
            playerName: string;
        }
    ) => JoinedMatch;

    updatePlayer: (
        options: {
            gameName: string;
            matchID: string;
            playerID: string;
            credentials: string;
            newName: string;
        }
    ) => void;
}
