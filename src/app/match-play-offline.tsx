import React from "react";
import { Client, BoardProps as BgioBoardProps} from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { AppGame } from "../app-game-support";
import { GameBoard } from "./game-board";
import { OfflineOptions } from "./offline-options";
import { Ctx } from "boardgame.io";


export function MatchPlayOffline(props: {
    game:AppGame,
    options: OfflineOptions,
}): JSX.Element {

    const { 
        game,
        options: {numPlayers, debugPanel, startupData}
    } = props;

    const wrappedSetup = (ctx: Ctx) => game.setup(ctx, startupData);

    const GameClient = Client({
        game: {...game, setup: wrappedSetup},
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


