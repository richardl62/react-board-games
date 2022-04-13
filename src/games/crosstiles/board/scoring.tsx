import React from "react";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";

export function Scoring() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerToScore } = context;
    const { moves, playerID, getPlayerName } = context.wrappedGameProps;
  
    if(stage !== GameStage.scoring) {
        return null;
    }

    sAssert(playerToScore);

    if(playerToScore === playerID) {
        const onClick = () => moves.setScore({
            category: "length3",
            score: 1,
        });
        return <button onClick={onClick}>Score</button>;
    }

    const name = getPlayerName(playerToScore);

    return <div>
        {`${name} to score`}
    </div>;
}