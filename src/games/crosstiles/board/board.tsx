import React from "react";
import { WaitingForPlayers } from "../../../app-game-support";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";

export function Board(): JSX.Element {
    const context = useCrossTilesContext();
    const {wrappedGameProps, selectedLetters} = context;

    if(!wrappedGameProps.allJoined) {
        <WaitingForPlayers {...wrappedGameProps} />;
    }

    const changeLetters = () => wrappedGameProps.moves.changeSelectedTiles();

    return <div>
        <div>
            <span>{"Selected letters: "}</span>
            {selectedLetters.map((l, index) => <span key={index}>{l}</span>)}
        </div>
        <div>
            <button onClick={changeLetters}>Change Letters</button>
        </div>
    </div>;
}
