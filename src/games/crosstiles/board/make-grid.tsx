import React from "react";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { Letter } from "../config";
import { GameStage } from "../server-side/server-data";
import { Tile } from "./tile";

export function MakeGrid() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, rack } = context;
    const { moves } = context.wrappedGameProps;

    if(stage !== GameStage.makingGrids) {
        return null;
    }
    sAssert(rack);


    const dummyGrid: Letter[][] = [["A"]];
    return <div>
        <div>
            {rack.map((l, index) => <Tile key={index} letter={l} />)}
        </div>
        <button onClick={() => moves.recordGrid(dummyGrid)}>Record Grid</button>
    </div>;
}