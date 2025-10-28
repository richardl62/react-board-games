
import { useSearchParams } from "react-router-dom";
import { MatchID, Player } from "./app-game-support";

export const keys = {
    credentials: "cred",
    matchID: "id",
    pid: "pid",
} as const;

export function useSearchParamData() {

    const [searchParams] = useSearchParams();

    const allKeys : string[]= Object.values(keys);
    for (const key of searchParams.keys()) {
        if (!allKeys.includes(key)) {
            console.warn("Unknown URL parameter:", key);
        }
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
        isOffline: player === null,
        matchID,
    };
}

export function useSetSearchParam() {

    const [searchParams, setSearchParams] = useSearchParams();

    function addPlayer(matchID: MatchID, player: Player): void {
        
        if(matchID.mid !== searchParams.get(keys.matchID)) {
            console.warn(`Unexpected matchID in addPlayer: given ${matchID.mid}`
                + ` but URL has ${searchParams.get(keys.matchID)}`
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
