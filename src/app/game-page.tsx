import { useEffect, useState } from 'react';
import { MatchID, Player } from './types';
import { AppGame } from '../app-game';
import { GamePlayLocal, GamePlayOnline } from './game-play';
import { LobbyClient } from './lobby-client';
import { openMatchPage } from './url-params';
const numPlayersKludged = 2;

const localStorageKey = (id: string) => `bgio-match-${id}`;

const localStorage = {
  setPlayer: (matchID: MatchID, player: Player) => {
    const key = localStorageKey(matchID.mid);
    const json = JSON.stringify(player);

    window.localStorage.setItem(key, json);
  },

  getPlayer: (matchID: MatchID | null): Player | null => {
    if (matchID) {
      const key = localStorageKey(matchID.mid);
      const json = window.localStorage.getItem(key);

      return json && JSON.parse(json);
    }

    return null;
  }
};

interface GamePageProps {
  game: AppGame;
  local: boolean;
  matchID: MatchID | null;
}

function GamePage(props: GamePageProps) {
  const { game, local, matchID } = props;
  const [error, setError] = useState<Error | null>(null);
  const [player, setPlayer] = useState<Player | null>(localStorage.getPlayer(matchID));

  useEffect(() => {
    const doit = async () => {
      const lobbyClient = new LobbyClient(game, matchID);
      if (!matchID) {
        const mid = await lobbyClient.createMatch(numPlayersKludged);
        openMatchPage(mid);
      } else if (!player) {
        const p = await lobbyClient.joinMatch('someone');
        localStorage.setPlayer(matchID, p);
        setPlayer(p);
      }
    }

    if (!local) {
      doit().catch(setError);
    }
  }, [game, local, matchID, player]);

  if (local) {
    return <GamePlayLocal game={game} />;
  }

  if (error) {
    return <div>{`ERROR: ${error.message}`}</div>
  }

  if (matchID && player) {
    return <GamePlayOnline game={game} matchID={matchID} player={player} />
  }

  return <div>Waiting ...</div>
}

export { GamePage };
