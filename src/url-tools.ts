
import { useSearchParams } from "react-router-dom";
import { MatchID, Player } from "./app-game-support";

export const keys = {
    credentials: "cred",
    matchID: "id",
    pid: "pid",
    np: "np", // Number of players implies offline mode
} as const;

export interface SearchParamData {
    player: Player | null;
    isOffline: {numPlayers: number} | null;
    matchID: MatchID | null;
}

export function useSearchParamData() : SearchParamData {

    const [searchParams] = useSearchParams();

    const allKeys : string[]= Object.values(keys);
    for (const key of searchParams.keys()) {
        if (!allKeys.includes(key)) {
            console.warn("Unknown URL parameter:", key);
        }
    }

    const np = searchParams.get(keys.np);
    if (np) {
        if(allKeys.length > 1) {
            console.warn("Unexpected URL parameters present in offline mode - ignoring them");
        }
        
        const numPlayers = parseInt(np, 10);
        if(isNaN(numPlayers) || numPlayers < 1) {
            console.warn("Invalid number of players in offline mode:", np);
            return {
                player: null,
                isOffline: null,
                matchID: null,
            };
        }

        return {
            player: null,
            isOffline: {numPlayers},
            matchID: null,
        };
    }

    const matchID_ = searchParams.get(keys.matchID);
    const matchID: MatchID | null = matchID_ ? { mid: matchID_ } : null;

    const pid = searchParams.get(keys.pid);
    const credentials = searchParams.get(keys.credentials);

    let player : Player | null;
    if (pid && credentials) {
        player = {
            id: pid,
            credentials: credentials,
        };
    } else {
        if (pid || credentials) {
            console.warn("Only one of player id or credentials is set in URL - ignoring both");
        }
        player = null;
    }

    return {
        player,
        matchID,
        isOffline: null,
    };
}

export function useSetSearchParam() {

    const [searchParams, setSearchParams] = useSearchParams();

    function addPlayer(matchID: MatchID, player: Player): void {

        const urlMatchID = searchParams.get(keys.matchID);
        if(urlMatchID && matchID.mid !== urlMatchID) {
            console.warn(`Unexpected matchID in addPlayer: given ${matchID.mid}`
                + ` but URL has ${urlMatchID}`
            );
        }

        searchParams.set(keys.matchID, matchID.mid);
        searchParams.set(keys.pid, player.id);
        searchParams.set(keys.credentials, player.credentials);
        setSearchParams(searchParams);
    }

    function addMatchID(matchID: MatchID): void {

        if(searchParams.get(keys.matchID)) {
            console.warn("Overwriting existing matchID in URL")
        }

        searchParams.set(keys.matchID, matchID.mid);
        setSearchParams(searchParams);
    }

    return {
        addPlayer,
        addMatchID,
    };
}
