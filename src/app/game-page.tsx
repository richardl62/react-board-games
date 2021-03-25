import {  useState } from 'react';
import { LobbyClient } from 'boardgame.io/client';

import { Game, Servers, JoinedMatch, numPlayers } from './types'
import { GameLobby } from './game-lobby';
import { GamePlay } from './game-play';


const gameName = 'chess5aside';



async function joinMatch(game: Game) : Promise<JoinedMatch> {
  const playerID = '0'; // KLUDGE
  const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' });
  const { matchID } = await lobbyClient.createMatch(gameName, {
    numPlayers: numPlayers
  });

  const { playerCredentials } = await lobbyClient.joinMatch(
    game.name,
    matchID,
    {
      playerID: playerID,
      playerName: 'Alice',
    }
  );

  return {
    game: game,
    matchID: matchID,
    playerID: playerID,
    playerCredentials: playerCredentials,
  }; 
}

interface GamePageProps {
  game: Game;
  bgioDebugPanel: boolean;
  matchID: string | null;
  servers: Servers;
}

interface ActiveMatchProps {
  game: Game;
  bgioDebugPanel: boolean;
  matchID: string;
  servers: Servers;
}

function ActiveMatch(props: ActiveMatchProps ) {
  const {game, bgioDebugPanel, servers} = props;

  const [joinedMatch, setJoinedMatch] = useState<null | 'waiting' | JoinedMatch | Error>(null);
  console.log("ActiveMatch player:", joinedMatch);

  if (joinedMatch === null) {
    setJoinedMatch('waiting');
    console.log("About to call joinMatch");
 
    joinMatch(game).then(joined => {
      console.log("Join match returned", joined);
      setJoinedMatch(joined);
    }).catch(err => {
      console.error(err);
      setJoinedMatch(err);
    });
    return null;
  }

  if (joinedMatch instanceof Error) {
    return (<div>{"Error: " + joinedMatch.message}</div>)
  }

  if (joinedMatch === 'waiting') {
    return (<div>Waiting ...</div>);
  }

  return (
    <div>
      <div>{`You are player: ${joinedMatch.playerID}`}</div>

      <GamePlay
        joinedMatch={joinedMatch}
        bgioDebugPanel={bgioDebugPanel}
        server={servers.lobby}
      />
    </div>
  );
}


export function GamePage(props: GamePageProps) {
  if(props.matchID) {
    return <ActiveMatch {...props} matchID={props.matchID} />;
  } else {
    return <GameLobby {...props} />;
  }
}

