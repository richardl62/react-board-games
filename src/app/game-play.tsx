import { Client } from "boardgame.io/react";
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { AppGame } from "../app-game";
import { MatchID, Player } from "./types";
import * as UrlParams from './url-params';
import styles from './app.module.css';
import { nonNull } from "../tools";
import { unnamedPlayer } from "./lobby-client";

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


function Players(props: any /*KLUDGE*/) {
  const ctx = props.ctx;
  const matchData = props.matchData;

  const validIndex = (str: string) => {
    const index = parseInt(str);
    if(isNaN(index) || index < 0 || index >= matchData.length) {
      throw new Error("Bad player index");
    }
    return index;
  }

  const playerID  = validIndex(props.playerID);

  const playerElem = (p: any, index: number) => {

    let text: string;
    if (!p.name) {
      text = '<waiting>';
    } else if (p.name === unnamedPlayer) {
      text = (index === playerID) ? 'You' : `Player ${p.id}`;
    } else {
      text = p.name;
    }
    
    if(p.name && !p.isConnected) {
     text += ' (Offline)';
    }
    const isCurrentPlayer = index === validIndex(ctx.currentPlayer);


    return (
      <div key={p.id}
        className={isCurrentPlayer? nonNull(styles.currentPlayer) : undefined}
        >
        {text}
      </div>
    );
  }

  return (
    <div className={nonNull(styles.playerNames)}>
      {matchData.map(playerElem)}
    </div>
  );
}

interface GamePlayOnlineProps {
  game: AppGame;
  matchID: MatchID;
  numPlayers: number;
  player: Player;
};


export function GamePlayOnline({ game, matchID, numPlayers, player }: GamePlayOnlineProps) {

  const renderGame = (props: any /*kludge*/) => {
    return <div>
      <Players {...props}/>
      {game.renderGame(props)}
    </div>
  }

  const GameClient = Client({
    game: game,
    board: renderGame,
    multiplayer: SocketIO({ server: UrlParams.lobbyServer() }),

    numPlayers: numPlayers,
    debug: UrlParams.bgioDebugPanel,
  });

  return (
    <div>
      <GameClient matchID={matchID.mid} 
        playerID={player.id} credentials={player.credentials}
      />
    </div>
  );
}
