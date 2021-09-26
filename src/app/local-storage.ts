import { MatchID, Player } from '../shared/types';

const localStorageKey = (id: string) => `bgio-match-${id}`;
export function setStoredPlayer(matchID: MatchID, player: Player): void {
  if (matchID) {
    const key = localStorageKey(matchID.mid);
    const json = JSON.stringify(player);

    window.localStorage.setItem(key, json);
  }
}
export function getStoredPlayer(matchID: MatchID): Player | null {
  if (matchID) {
    const key = localStorageKey(matchID.mid);
    const json = window.localStorage.getItem(key);

    return json && JSON.parse(json);
  }

  return null;
}
