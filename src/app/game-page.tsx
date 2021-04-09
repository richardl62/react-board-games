import React from 'react';
import { AppGame } from '../app-game';
import Lobby from './lobby';
import { SocketIO, Local } from 'boardgame.io/multiplayer'
import { Client } from 'boardgame.io/react';
import { LobbyClient } from './lobby-client';
import { AppOptions } from './app-options';
import { Servers } from './types';

interface GamePageProps {
  appOptions: AppOptions;
  setAppOptions: (opt: AppOptions) => void;
  game: AppGame;
  servers: Servers;
  online: boolean;
}

function LocalGame({ game, appOptions } : GamePageProps) {
  const GameClient = Client({
    game: game,
    board: game.renderGame,
    multiplayer: Local(),
  });

  return (<div>
    <GameClient />
  </div>);
}

function OnlineGame({ game, servers, appOptions } : GamePageProps) {
  const {matchID, player} = appOptions;
  if(!player || !matchID) {
    throw new Error("player and match are not both defined");
  }

  const GameClient = Client({
    game: game,
    board: game.renderGame,
    multiplayer: SocketIO({server: servers.lobby}),
  });
  
    return (<div>
      <div>{`Match: ${matchID}  Player: ${player.id} (${player.credentials})`}</div>
      <GameClient matchID={matchID} playerID={player.id} credentials={player.credentials} />
    </div>);
}


function GamePage(props: GamePageProps) {
  const { appOptions, setAppOptions, game, servers, online } = props;

  if(!online) {
    return <LocalGame {...props} />;
  } else if (appOptions.matchID && appOptions.player) {
    return <OnlineGame {...props} />;
  } else {
    const lobbyClient = new LobbyClient(game, servers, appOptions.matchID);
    return <Lobby lobbyClient={lobbyClient} appOptions={appOptions} setAppOptions={setAppOptions}/>
  }
}

export { GamePage };
