// Get values that can be set in the url.
// If not set, give default value.
import { sAssert } from "../shared/assert";
import { AppGame, MatchID, Player } from "../shared/types";

const usp = new URLSearchParams(window.location.search);

const getAndDelete = (key: string) => {
    const val = usp.get(key);
    usp.delete(key);
    return val;
};

function getAndDeleteFlag(key: string) : boolean {
    const falsey = [null, "0","false"];
    const truthy  = ["", "1","true"];

    const str = getAndDelete(key);

    if (falsey.includes(str)) {
        return false;
    }
  
    sAssert(str);
    if (truthy.includes(str)) {
        return true;
    }

    console.warn(`Bad value for URL boolean ${key}: ${str}`);
    return false; // Well, why not?

}


const ppb = getAndDelete("ppb");
export const playersPerBrowser = ppb ? parseInt(ppb) : 1;

export const bgioDebugPanel = getAndDeleteFlag("debug-panel");

const matchID_ = getAndDelete("match-id");
export const matchID : MatchID | null = matchID_ ? {mid: matchID_} : null;

const server = getAndDelete("server");

export interface OfflineGameData {
  nPlayers:number;
  persist: boolean;
}

export let offline : null | OfflineGameData= null;
if(getAndDeleteFlag("offline")){
    const np_ = getAndDelete("np");
    if(np_){
        offline = {
            nPlayers: parseInt(np_),
            persist: getAndDeleteFlag("persist"),
        };
    } else {
        console.warn("URL param 'np' is missing (required for offline game)");
    }
}

function getAndDeletePlayer() : Player | null {
    const pid = getAndDelete("pid");
    const credentials = getAndDelete("credentials");

    if(pid && credentials) {
        return {
            id: pid,
            credentials: credentials,
        };
    }

    if(pid || credentials) {
        console.warn("URL has one but not both of player id and credentials");
    }

    return null;
}

export const player = getAndDeletePlayer();

  
if (usp.toString()) {
    console.warn("Unrecongised url parameters", usp.toString());
}

export function addPlayerToHref(player: Player) : string {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    searchParams.set("pid", player.id);
    searchParams.set("credentials", player.credentials);
    url.search = searchParams.toString();

    return  url.href;
}

export function gamePath(game: AppGame): string {
    return "/" + game.name;
}
export function lobbyServer(): string { 
    const url = new URL(window.location.href);
    let result;
    if(server) {
        result = server;
    } else {
        if(url.hostname === "localhost" && url.port === "3000") {
            url.port = "8000"; // kludge
        }
        result = url.origin;
    }
  
    return result;
}

