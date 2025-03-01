import React from "react";
import { Local } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";
import { AppGame, BoardProps } from "../app-game-support";
import { Ctx } from "./ctx";
import { RandomAPI } from "./random";
import { EventsAPI } from "./events";

function OfflineMatchORIGINAL({ game, board, id, numPlayers }: {
    game: AppGame;
    board: (arg0: BoardProps) => JSX.Element;
    id: number;
    numPlayers: number;
}) {
    const multiplayer = Local();
    const debug = false;
    const GameClient = Client({ game, board, multiplayer, numPlayers, debug });

    return <GameClient playerID={id.toString()} />;
}

const dummyRandomAPI : RandomAPI = {
    Die: (_spotvalue) => {throw new Error("RandomAPI not implemented");},
    Shuffle: (_deck) => {throw new Error("RandomAPI not implemented");},
};

const dummyEventsAPI : EventsAPI = {
    endTurn: () => {throw new Error("EventsAPI not implemented");},
    endGame: (_arg0) => {throw new Error("EventsAPI not implemented");},
};

function OfflineMatchNEW({ game, board, id, numPlayers }: {
    game: AppGame;
    board: (arg0: BoardProps) => JSX.Element;
    id: number;
    numPlayers: number;
}) : JSX.Element {

    const ctx: Ctx = {
        numPlayers,

        // Everything below this is a TEMPORARY HACK
        playOrder: ["0"],
        currentPlayer: "0",
        playOrderPos: 0,
        gameover: false,
    };

    const setupData = undefined; // TEMPORARY HACK
    // HACK - G can be modified so should (presumably) be recorded as state.
    const G = game.setup({ ctx, random: dummyRandomAPI}, setupData);

    const boardProps : BoardProps = {
        playerID: id.toString(),
        matchID: "offline",
        ctx,
        moves: {},
        events: dummyEventsAPI,
        isConnected: true,
        G,
    };

    return board(boardProps);
}

const useNewOfflineMatch = true;
export const OfflineMatch = useNewOfflineMatch ?
    OfflineMatchNEW :
    OfflineMatchORIGINAL;



