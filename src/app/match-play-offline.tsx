import React from "react";
import { Client, BoardProps as BgioBoardProps} from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { AppGame } from "../utils/types";
import * as UrlParams from "./url-params";
import { GameBoard } from "./game-board";


interface MatchPlayLocalProps {
  game: AppGame;
  nPlayers : number;
  persist: boolean;
}


export function MatchPlayOffline({ game, nPlayers: numPlayers, persist}: MatchPlayLocalProps): JSX.Element {

    const GameClient = Client({
        game: game,
        board: (props: BgioBoardProps) => <GameBoard game={game} bgioProps={props} />,
        multiplayer: Local({persist:persist}),
        numPlayers: numPlayers,
        debug: UrlParams.bgioDebugPanel,
    });

    const games = [];
    for(let id = 0; id < numPlayers; ++id) {
        games[id] = <GameClient key={id} playerID={id.toString()} />;
    }
    return (
        <div>{games}</div> 
    );
}


