import React from "react";
import { Local } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";
import { AppGame, BoardProps as BgioBoardProps } from "../app-game-support";

export function OfflineMatch({ game, board, id, numPlayers }: {
    game: AppGame;
    board: (obProps: BgioBoardProps) => JSX.Element;
    id: number;
    numPlayers: number;
}) {
    const multiplayer = Local();
    const debug = false;
    const GameClient = Client({ game, board, multiplayer, numPlayers, debug });

    return <GameClient playerID={id.toString()} />;
}
