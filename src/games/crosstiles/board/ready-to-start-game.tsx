import React from "react";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";
import { PlayerStatus } from "./player-status";

export function ReadyToStartGame() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerData } = context;
    const { moves, playerID } = context.wrappedGameProps;

    if(stage !== GameStage.starting) {
        return null;
    }

    const message = (pid: string) => {
        return playerData[pid].readyToStartGame ?
            "Ready" : null;
    };

    const ready = playerData[playerID].readyToStartGame;
    return <div>
        {!ready && <button onClick={() => moves.readyToStartGame()}>Ready</button>}
        <PlayerStatus message={message} />
    </div>;
}