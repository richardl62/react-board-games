import { MatchList, Match, CreatedMatch, JoinedMatch } from "./types";

export interface LobbyInterface {

    listMatches: (
        gameName: string
    ) => MatchList;
    
    getMatch(
        gameName: string, 
        matchID: string
    ): Match;
    
    createMatch: (
        gameName: string, 
        body: {
            numPlayers: number;
            setupData: unknown;
        }
    ) => CreatedMatch;

    joinMatch: (
        gameName: string, 
        matchID: string, 
        body: {
            playerName: string;
        }
    ) => JoinedMatch;

    updatePlayer: (
        gameName: string,
        matchID: string, 
        body: {
            playerID: string;
            credentials: string;
            newName: string;
        }
    ) => void;
}
