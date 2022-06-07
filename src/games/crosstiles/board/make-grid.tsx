import React, { useEffect } from "react";
import styled from "styled-components";
import { useCountdown } from "../../../utils/use-countdown";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";
import { GridStatus } from "./grid-status";
import { RackAndBoard } from "./rack-and-board";

const OuterDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: start; 
`;

const TimeLeft = styled.span`
    font-size: large;
`;

const ButtonAndTimeDiv = styled.div`
    margin-top: 6px;

    button {
        margin-right: 4px;   
    }
`;

function minutesAndSeconds(secondsFactional: number) {
    const seconds = Math.floor(secondsFactional + 0.5);
    const minutes =  Math.floor(seconds/60);
    const remainder = seconds % 60;
    const padding = remainder < 10 ? "0" : "";

    return `${minutes}:${padding}${remainder}`;
}

export function MakeGrid() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { playerData, stage, grid, round, options } = context;
    const { moves,  playerID } = context.wrappedGameProps;

    const {secondsLeft, reset} = useCountdown(options.timeToMakeGrid);
    useEffect(reset, [round]);

    const  recordGrid = () => moves.recordGrid(grid);

    const doneRecording = () => {
        recordGrid();
        moves.doneRecordingGrid();
    };

    useEffect(
        () => {
            if (stage === GameStage.makingGrids && secondsLeft === 0) {
                doneRecording();
            }
        },
        [secondsLeft]);

    const amDoneRecording = playerData[playerID].doneRecordingGrid;

    if(stage !== GameStage.makingGrids) {
        return null;
    }

    const gridRecorded = Boolean(playerData[playerID].grid);
    return <OuterDiv>
        <RackAndBoard />
        <GridStatus scoreCard={playerData[playerID].scoreCard} grid={grid} />
        <ButtonAndTimeDiv>
            <button onClick={recordGrid} disabled={amDoneRecording} >
                {gridRecorded ? "Record New Grid" : "Record Grid" }
            </button>
            <button onClick={doneRecording} disabled={amDoneRecording} >
                Done
            </button>
            <TimeLeft>{"Time left " + minutesAndSeconds(secondsLeft)}</TimeLeft>
        </ButtonAndTimeDiv>
    </OuterDiv>;
}