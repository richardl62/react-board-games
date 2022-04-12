import React from "react";
import { WaitingForPlayers } from "../../../app-game-support";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";

export function Board(): JSX.Element {
    const context = useCrossTilesContext();
    const {wrappedGameProps} = context;
    const { moves } = wrappedGameProps;

    if(!wrappedGameProps.allJoined) {
        <WaitingForPlayers {...wrappedGameProps} />;
    }

    return <div>
        <button onClick={()=>moves.playerReady()}>Ready</button>
    </div>;
}
