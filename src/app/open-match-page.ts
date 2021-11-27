import * as LobbyClient from "../bgio/bgio";
import { AppGame, MatchID } from "../shared/types";

export function getOfflineMatchLink(nPlayers: number, persistentState: boolean): string {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    searchParams.set("offline", "1");
    searchParams.set("np", nPlayers.toString());
    if(persistentState) {
        searchParams.set("persist", "1");
    }
    url.search = searchParams.toString();

    return url.href;
}

interface OpenMatchPageArgs {
  game: AppGame;
  nPlayers: number;
  setWaiting: (arg: boolean) => void;
  setError: (arg: Error) => void;
}

export function openOnlineMatchPage({ game, nPlayers, setWaiting, setError }: OpenMatchPageArgs): void {

    const doOpen = (matchID: MatchID) => {
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        searchParams.set("match-id", matchID.mid);
        url.search = searchParams.toString();

        window.location.href = url.href;
    };

    setWaiting(true);
    LobbyClient.createMatch(game, nPlayers)
        .then(doOpen)
        .catch(setError);
}
