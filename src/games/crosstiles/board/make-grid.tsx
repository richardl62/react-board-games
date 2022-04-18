import React, { useEffect } from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCountdown } from "../../../utils/use-countdown";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { maxTimeToMakeGrid } from "../config";
import { GameStage } from "../server-side/server-data";
import { RackAndBoard } from "./rack-and-board";

const OuterDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: start;
    > * {
        margin-bottom: 10px;
    }    
`;

const TimeLeft = styled.span`
    font-size: large;
    margin-left: 0.4em;
`;

function minutesAndSeconds(seconds: number) {
    const minutes =  Math.floor(seconds/60);
    const remainder = seconds % 60;
    const padding = remainder < 10 ? "0" : "";

    return `${minutes}:${padding}${remainder}`;

}
export function MakeGrid() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, rack, grid, round } = context;
    const { moves } = context.wrappedGameProps;

    const {secondsLeft, reset} = useCountdown(maxTimeToMakeGrid);
    useEffect(reset, [round]);

    if(stage !== GameStage.makingGrids) {
        return null;
    }
    sAssert(rack);

    return <OuterDiv>
        <RackAndBoard />

        <div>
            <button onClick={() => moves.recordGrid(grid)}>Record Grid</button>
            <TimeLeft>{minutesAndSeconds(secondsLeft)}</TimeLeft>
        </div>
    </OuterDiv>;
}