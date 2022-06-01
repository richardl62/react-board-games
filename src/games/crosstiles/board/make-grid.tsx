import React, { useEffect } from "react";
import styled from "styled-components";
import { useCountdown } from "../../../utils/use-countdown";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { checkGrid } from "../client-side/check-grid/check-grid";
import { GameStage } from "../server-side/server-data";
import { GridStatus } from "./grid-status";
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
    const { playerData, stage, grid, round, options, isLegalWord } = context;
    const { moves,  playerID } = context.wrappedGameProps;

    const {secondsLeft, reset} = useCountdown(options.timeToMakeGrid);
    useEffect(reset, [round]);

    const  recordGrid = () => moves.recordGrid(grid);
    useEffect(
        () => {
            if (stage === GameStage.makingGrids && secondsLeft === 0) {
                moves.recordGrid(grid);
            }
        },
        [secondsLeft]);

    if(stage !== GameStage.makingGrids) {
        return null;
    }

    const gridRecorded = Boolean(playerData[playerID].grid);
    const checkGridResult = checkGrid(playerData[playerID].scoreCard, grid,isLegalWord);
    return <OuterDiv>
        <RackAndBoard />
        <GridStatus checkGridResult={checkGridResult} />
        <div>
            <button onClick={recordGrid}>
                {gridRecorded ? "Change Recorded Grid" : "Record Grid" }
            </button>
            <TimeLeft>{"Time left " + minutesAndSeconds(secondsLeft)}</TimeLeft>
        </div>
    </OuterDiv>;
}