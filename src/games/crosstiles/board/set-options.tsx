import React from "react";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";

export function SetOptions() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage } = context;
    const { moves, playerID, getPlayerName, ctx } = context.wrappedGameProps;

    if(stage !== GameStage.settingOptions) {
        return null;
    }

    const firstPlayer = ctx.playOrder[0];
    if(playerID === firstPlayer) {
        return <button onClick={() => moves.setOptions()}>Set Options</button>;
    }

    return <div>{`Waiting for ${getPlayerName(firstPlayer)} to set options`}</div>;
}