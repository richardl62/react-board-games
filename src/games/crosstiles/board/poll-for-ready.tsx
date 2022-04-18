import React from "react";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";

export function PollForReady() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage } = context;
    const { moves } = context.wrappedGameProps;

    if(stage !== GameStage.pollingForReady) {
        return null;
    }

    return <div>
        <button onClick={() => moves.playerReady()}>Ready</button>
    </div>;
}