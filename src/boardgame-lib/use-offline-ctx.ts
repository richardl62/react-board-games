import { useState } from "react";
import { MatchDataElem } from "./board-props";
import { Ctx } from "./ctx";
import { EventsAPI } from "./events";

export function useOfflineCtx(numPlayers: number) : {
    ctx: Ctx, 
    matchData: MatchDataElem[], 
    events: EventsAPI
} {
    const playOrder = [];
    const matchData: Required<MatchDataElem>[] = [];
    for (let i = 0; i < numPlayers; i++) {
        playOrder.push(i.toString());
        matchData.push({
            id: i,
            name: "Player " + i,
            isConnected: true,
        });
    }

    const startingCtx: Required<Ctx> = {
        numPlayers,
        playOrder,
        currentPlayer: "0",
        playOrderPos: 0,
        gameover: false,
    };

    //Consider using useImmer
    const [ctx, setCtx] = useState(startingCtx);   
    
    const events : EventsAPI = {
        endTurn: () => {
            const newPlayOrderPos = (ctx.playOrderPos + 1) % ctx.numPlayers;
            const newCtx : Required<Ctx> = JSON.parse(JSON.stringify(ctx)); // Future proofing
            newCtx.playOrderPos = newPlayOrderPos;
            newCtx.currentPlayer = ctx.playOrder[newPlayOrderPos];
            setCtx(newCtx);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        endGame: (_arg0) => {throw new Error("endGame not implemented");},
    };
    return {ctx, matchData, events};
}