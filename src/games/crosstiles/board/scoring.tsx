import React from "react";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";

export function Scoring() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage } = context;
    const { moves } = context.wrappedGameProps;

    if(stage !== GameStage.scoring) {
        return null;
    }

    return <button onClick={()=>moves.playerReady()}>Scoring</button>;
}