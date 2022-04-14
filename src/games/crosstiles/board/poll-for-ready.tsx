import React, { useEffect } from "react";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";
import { useCountdown } from "../../../utils/use-countdown";
import { maxTimeToMakeGrid } from "../config";


export function PollForReady() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, round } = context;
    const { moves } = context.wrappedGameProps;

    const {secondsLeft, stop, reset} = useCountdown(maxTimeToMakeGrid);

    useEffect(reset, [round]);

    if(stage !== GameStage.pollingForReady) {
        return null;
    }

    return <div>
        <div>{`${secondsLeft}`}</div>
        <div>
            <button onClick={stop}>Stop</button>
            <button onClick={() => reset()}>Reset</button>
        </div>
        <button onClick={() => moves.playerReady()}>Ready</button>
    </div>;
}