
import { useSearchParams } from "react-router-dom";
import { MatchID, Player } from "./app-game-support";

// Known URL parameters: The values are the actual URL parameter names.
export const knownParams = {
    matchID: "mid",
    pid: "pid",
    credentials: "cred",
    numPlayers: "np", // implies offline mode if set
    seed: "seed", // (Pseudo) random seed
}

export interface SearchParamData {
    player: Player | null;
    isOffline: {numPlayers: number} | null;
    matchID: MatchID | null;

    // A seed suppied as a search parameter can be any non-negative number,
    // but the number below, if set, will be in [0,1)
    seed: number | null; 
}

export function useSearchParamData() : SearchParamData {

    const [foundParams] = useSearchParams();

    for (const found of foundParams.keys()) {
        if (!Object.values(knownParams).includes(found)) {
            console.warn("Unexpected URL parameter:", found);
        }
    }

    const result: SearchParamData = {
        player: null,
        isOffline: null,
        matchID: null,
        seed: null
    }
    
    const numPlayers_ = foundParams.get(knownParams.numPlayers);
    if (numPlayers_) {
        /* offline mode */
        const numPlayers = parseInt(numPlayers_, 10);
        if(isNaN(numPlayers) || numPlayers < 1) {
            console.warn("Invalid number of players in offline mode:", numPlayers_);
        } else {
            result.isOffline = {numPlayers};
        }
    } else {
        const matchID = foundParams.get(knownParams.matchID);
        if (matchID) {
            result.matchID = { mid: matchID };
        }

        const pid = foundParams.get(knownParams.pid);
        const credentials = foundParams.get(knownParams.credentials);
        if (pid && credentials) {
            result.player = { id: pid, credentials };
        } else if (pid || credentials) {
            console.warn("Only one of player id or credentials is set in URL - ignoring both");
        }
    }

    const userSeed_ = foundParams.get(knownParams.seed);
    if (userSeed_) {
        const userSeed = parseInt(userSeed_, 10);
        if (isNaN(userSeed) || userSeed < 0) {
            console.warn("Invalid seed value in URL:", userSeed_, " (must be non-negative number)");
        } else {
            // result.seed must be in [0,1). The mapping below is crude but should be good enough.
            result.seed = 1 / (1.0 + userSeed);
        }
    }

    return result;
}

export function useSetSearchParam() {

    const [searchParams, setSearchParams] = useSearchParams();

    function addPlayer(matchID: MatchID, player: Player): void {

        const urlMatchID = searchParams.get(knownParams.matchID);
        if(urlMatchID && matchID.mid !== urlMatchID) {
            console.warn(`Unexpected matchID in addPlayer: given ${matchID.mid}`
                + ` but URL has ${urlMatchID}`
            );
        }

        searchParams.set(knownParams.matchID, matchID.mid);
        searchParams.set(knownParams.pid, player.id);
        searchParams.set(knownParams.credentials, player.credentials);
        setSearchParams(searchParams);
    }

    function addMatchID(matchID: MatchID): void {

        if(searchParams.get(knownParams.matchID)) {
            console.warn("Overwriting existing matchID in URL")
        }

        searchParams.set(knownParams.matchID, matchID.mid);
        setSearchParams(searchParams);
    }

    return {
        addPlayer,
        addMatchID,
    };
}
