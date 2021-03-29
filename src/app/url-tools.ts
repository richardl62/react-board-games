import { Player } from './lobby';

function makeURL(location: Location, matchID: string | null, player: Player | null) {
  let params = new URLSearchParams();

  if(matchID) {
    params.set('match', matchID);
  }

  if (player) {
    params.set('player', JSON.stringify([player.id, player.credentials]));
  }

  let newURL = new URL(location.href);
  newURL.search = params.toString();

  return newURL.toString();
}

function parseURL(location: Location): [string | null, Player | null] {
  const inputURL = new URL(location.href);
  const matchID = inputURL.searchParams.get('match');
  const playerString = inputURL.searchParams.get('player');

  if (!playerString) {
    return [matchID, null];
  }

  const obj = JSON.parse(playerString);
  if (obj instanceof Array && obj.length === 2) {
    const [id, credentials] = obj;
    const player = { id: id, credentials: credentials };
    return [matchID, player];
  }

  throw new Error("Invalid game information in URL");
}

class PlayerAndMatchID {
  constructor(location: Location) {
    this.location = location;
    [this.matchID, this.player] = parseURL(location);
  }
  location: Location;
  matchID: string | null;
  player: Player | null;

  set(matchID: string, player: Player | null = null ) {
    this.matchID = matchID;
    this.player = player;
  }

  href() {
    return makeURL(this.location, this.matchID, this.player);
  }
}

export { PlayerAndMatchID };