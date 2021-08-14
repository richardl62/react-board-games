import * as LobbyClient from '../shared/bgio';
import { AppGame, MatchID } from "../shared/types";

export function openOnlineMatchPage(matchID: MatchID) {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  searchParams.set('match-id', matchID.mid);
  url.search = searchParams.toString();

  window.location.href = url.href;
}

export function openOfflineMatchPage() {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  searchParams.set('offline', "1");
  url.search = searchParams.toString();

  window.location.href = url.href;
}

interface OpenMatchPageArgs {
  game: AppGame;
  nPlayers: number;
  matchID?: string;
  local: boolean;
  setWaiting: (arg: boolean) => void;
  setError: (arg: Error) => void;
}

export function openMatchPage({game, nPlayers, matchID, local, setWaiting, setError}: OpenMatchPageArgs) {

    if (local) {
      openOfflineMatchPage();
    } else {
      setWaiting(true);
      LobbyClient.createMatch(game, nPlayers)
        .then(openOnlineMatchPage)
        .catch(setError);
    }

}
