import React from "react";
import { ReactCribbageContext } from "./cribbage-context";
import { Cribbage } from "./board/game";
import { startingState } from "./actions/game-state";

export function GameWrapper(): JSX.Element {
    return <ReactCribbageContext.Provider value={startingState}>
        <Cribbage />
    </ReactCribbageContext.Provider>;
}