import React, { useState } from "react";
import { Local } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";
import { AppGame, BoardProps } from "../app-game-support";
import { Ctx } from "./ctx";
import { RandomAPI } from "./random";
import { EventsAPI } from "./events";
import { MatchDataElem } from "./board-props";
import { RequiredServerData } from "../app-game-support/required-server-data";

function OfflineMatchORIGINAL({ game, board, id, numPlayers }: {
    game: AppGame;
    board: (arg0: BoardProps) => JSX.Element;
    id: number;
    numPlayers: number;
}) {
    const multiplayer = Local();
    const debug = true;
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

function wrapMoves(
    unwrappedMoves: AppGame["moves"], 
    ctx: Ctx, 
    id: number, 
    G: RequiredServerData, 
    setG: (newG: RequiredServerData) => void
) : BoardProps["moves"] {

    const wrappedMoves: BoardProps["moves"] = {};

    for (const moveName in unwrappedMoves) {
        wrappedMoves[moveName] = (...args: unknown[]) => {
            const newG = JSON.parse(JSON.stringify(G));
            const moveFn = unwrappedMoves[moveName];
            moveFn({
                G: newG,
                ctx,
                playerID: id.toString(),
                random: dummyRandomAPI,
                events: {} as Required<EventsAPI>,
            }, ...args);
            
            setG(newG);
        };
    }
    return wrappedMoves;
}

function OfflineMatchNEW({ game, board, id, numPlayers }: {
    game: AppGame;
    board: (arg0: BoardProps) => JSX.Element;
    id: number;
    numPlayers: number;
}) : JSX.Element {

    const playOrder = [];
    const matchData : Required<MatchDataElem>[] = [];
    for (let i = 0; i < numPlayers; i++) {
        playOrder.push(i.toString());
        matchData.push({
            id: i, 
            name: "Player " + i,
            isConnected: true, 
        });
    }

    const ctx: Required<Ctx> = {
        numPlayers,
        playOrder,
        currentPlayer: "0",
        playOrderPos: 0,
        gameover: false,
    };


    const startingData = game.setup({ ctx, random: dummyRandomAPI}, 
        undefined /* TEMPORARY HACK */ 
    );
    const [G, setG] = useState(startingData);

    const boardProps : Required<BoardProps> = {
        playerID: id.toString(),
        credentials: "offline",
        matchID: "offline",
        matchData,
        ctx,
        moves: wrapMoves(game.moves, ctx, id, G, setG),
        events: dummyEventsAPI,
        isConnected: true,
        G,
    };

    return <div>
        <div>*** ${JSON.stringify(G)} ***</div>
        {board(boardProps)}
    </div>;
}

const useNewOfflineMatch = true;
export const OfflineMatch = useNewOfflineMatch ?
    OfflineMatchNEW :
    OfflineMatchORIGINAL;