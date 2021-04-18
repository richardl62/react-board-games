import { Client } from "boardgame.io/react";
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { AppGame } from "../app-game";
import { MatchID, Player } from "./types";
import * as UrlParams from './url-params';

interface GamePlayLocalProps {
  game: AppGame;
}

export function GamePlayLocal({ game }: GamePlayLocalProps) {
  const GameClient = Client({
    game: game,

    board: game.renderGame,
    multiplayer: Local(),

    numPlayers: 1,
    debug: UrlParams.bgioDebugPanel,
  });

  return (<div> <GameClient /> </div>);
}

interface GamePlayOnlineProps {
  game: AppGame;
  matchID: MatchID;
  player: Player;
};

function ShowPlayers(props: any) {
  console.log("ShowPlayers:", props);
  return (
    <div>
      <div>{`PlayerID: ${props.playerID}`}</div>
      <div>{JSON.stringify(props.matchData)}</div>
    </div>
  );
}

export function GamePlayOnline({ game, matchID, player }: GamePlayOnlineProps) {

  const GameClient = Client({
    game: game,
    board: ShowPlayers, //game.renderGame,
    multiplayer: SocketIO({ server: UrlParams.lobbyServer() }),

    numPlayers: 2,// KLUDGE
    debug: UrlParams.bgioDebugPanel,
  });

  return (
    <div>
      {/* <div>{`Match: ${matchID.mid} Player: ${JSON.stringify(player)}`}</div> */}
      <GameClient matchID={matchID.mid}
        playerID={player.id} credentials={player.credentials}
      />
    </div>
  );
}
