import React from "react";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";

export function MakeGrid() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage } = context;
    const { moves } = context.wrappedGameProps;

    if(stage !== GameStage.makingGrids) {
        return null;
    }

    return <button onClick={()=>moves.playerReady()}>Make Grid</button>;
}