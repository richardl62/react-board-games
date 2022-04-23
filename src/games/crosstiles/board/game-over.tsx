import React from "react";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";

export function GameOver() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage } = context;
    const { moves } = context.wrappedGameProps;

    if(stage !== GameStage.gameOver) {
        return null;
    }

    return <button onClick={()=>moves.playerReady()}>Game Over</button>;
}