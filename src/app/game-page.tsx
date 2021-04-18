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

  getPlayer: (matchID: MatchID): Player | null => {
    if (matchID) {
      const key = localStorageKey(matchID.mid);
      const json = window.localStorage.getItem(key);

      return json && JSON.parse(json);
    }

    return null;
  }
};

interface JoinMatchProps {
  joinMatch: (arg: string) => void;
}

function JoinMatch({joinMatch} : JoinMatchProps) {
  const [name, setName ] = useState<string>('');
  return (
    <div>
      <div>
        <label>Name</label>
        <input value={name} placeholder='Player name' onInput={e => setName(e.currentTarget.value)} />
        <button type="button" onClick={()=>joinMatch(name)}>
          Join Game
        </button>
      </div>
    </div>);
} 

interface GamePageProps {
  game: AppGame;
  local: boolean;
  matchID: MatchID | null;
}

function GamePage(props: GamePageProps) {
  const { game, local, matchID } = props;
  const [error, setError] = useState<Error | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if(local) {
      return;
    }
    if(!matchID) {
      const lobbyClient = new LobbyClient(game, null);
      lobbyClient.createMatch(numPlayersKludged).then(openMatchPage).catch(setError);
    } else if (!player) {
      const p = localStorage.getPlayer(matchID);
      if(p) {
        setPlayer(p);
      }
    }
  }, [game, local, matchID, player]);

  const joinMatch = (name: string) => {
    const doit = async() => {
      const lobbyClient = new LobbyClient(game, matchID);
      const p = await lobbyClient.joinMatch(name);
      localStorage.setPlayer(matchID!, p);
      setPlayer(p);
    }

    doit().catch(setError);
  }

  if (local) {
    return <GamePlayLocal game={game} />;
  }

  if (error) {
    return <div>{`ERROR: ${error.message}`}</div>
  }

  if (matchID && !player) {
    return <JoinMatch joinMatch={joinMatch}/>;
  }
  if (matchID && player) {
    return <GamePlayOnline 
      game={game} matchID={matchID} player={player} 
      numPlayers={numPlayersKludged}
      />
  }

  return <div>Waiting ...</div>
}

export { GamePage };
