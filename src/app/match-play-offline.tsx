import React from "react";
import { Client, BoardProps as BgioBoardProps} from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { AppGame } from "../app-game-support";
import { GameBoard } from "./game-board";
import { OfflineOptions } from "./offline-options";


export function MatchPlayOffline(props: {
    game:AppGame,
    options: OfflineOptions,
}): JSX.Element {

    const { 
        game,
        options: {numPlayers, debugPanel}
    } = props;

    const GameClient = Client({
        game,
        board: (props: BgioBoardProps) => <GameBoard game={game} bgioProps={props} />,
        multiplayer: Local(),
        numPlayers,
        debug: debugPanel,
    });

    const games = [];
    for(let id = 0; id < numPlayers; ++id) {
        games[id] = <GameClient key={id} playerID={id.toString()} />;
    }
    return (
        <div>{games}</div> 
    );
}


