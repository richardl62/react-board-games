import { useEffect, useState } from 'react';
import { MatchID } from './types';
import { AppGame } from '../app-game';
import { GamePlayLocal, GamePlayOnline } from './game-play';
import { LobbyClient } from './lobby-client';
import { openMatchPage } from './url-params';
const numPlayersKludged = 2;

interface GamePageProps {
  game: AppGame;
  local: boolean;
  matchID: MatchID | null;
}

function GamePage(props: GamePageProps) {
  const { game, local, matchID} = props;
  const [ error, setError ] = useState<Error|null>(null);

  useEffect(()=>{
    if (!local && !matchID) {
      const lobbyClient = new LobbyClient(game, null);
      lobbyClient.createMatch(numPlayersKludged)
        .then(openMatchPage)
        .catch(setError);
    }
  }, [game, local, matchID]);

  if(local) {
    return <GamePlayLocal game={game} />;
  }

  if(error) {
    return <div>{`ERROR: ${error.message}`}</div>
  }

  if(matchID) {
    return <GamePlayOnline game={game} matchID={matchID} />
  }

  return <div>Waiting ...</div>
}

export { GamePage };
