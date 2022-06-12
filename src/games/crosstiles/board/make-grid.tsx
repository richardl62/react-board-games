import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {  useNowTicker } from "../../../utils/use-countdown";
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
    const seconds = Math.max(Math.floor(secondsFactional + 0.5), 0);
    const minutes =  Math.floor(seconds/60);
    const remainder = seconds % 60;
    const padding = remainder < 10 ? "0" : "";

    return `${minutes}:${padding}${remainder}`;
}

function DoneDialog() {
    const context = useCrossTilesContext();
    
    const { grid, playerData, wrappedGameProps: { moves, playerID } } = context;
    const { grid: recordedGrid, doneRecordingGrid: amDoneRecording } = playerData[playerID];

    const [confirmationRequired, setConfirmationRequired] = useState(false);

    const doneRecordedChecked = () => {
        if(recordedGrid) {
            moves.doneRecordingGrid();
        } else {
            setConfirmationRequired(true);
        }
    };

    const doneRecordedUnchecked = () => {
        moves.doneRecordingGrid();
        setConfirmationRequired(false);
    };

    const doneCancelled = () => {
        setConfirmationRequired(false);
    };

    if(confirmationRequired) {
        return <div>
            <span>No grid recorded </span>
            <button onClick={doneRecordedUnchecked} >Confirm Done</button>
            <button onClick={doneCancelled}>Cancel</button>
        </div>;
    }

    return <div>
        <button onClick={() => moves.recordGrid(grid)}
            disabled={amDoneRecording}
        >
            Record Grid
        </button>

        <button onClick={doneRecordedChecked} disabled={amDoneRecording} >
            Done
        </button>
    </div>;
}

export function MakeGrid() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { playerData, stage, grid, options } = context;
    const { moves,  playerID } = context.wrappedGameProps;

    const now = useNowTicker();
    const {makeGridStartTime, doneRecordingGrid: amDoneRecording } = playerData[playerID];

    useEffect(()=>{
        if(stage === GameStage.makingGrids) {

            if(makeGridStartTime === null) {
                moves.setMakeGridStartTime(now);
            } else {
                const timesUp = options.timeToMakeGrid < (now - makeGridStartTime) / 1000;
                if(timesUp && !amDoneRecording) {
                    moves.doneRecordingGrid();
                }
            }
        }
    });

    if(stage !== GameStage.makingGrids) {
        return null;
    }

    if(makeGridStartTime === null) {
        return null;
    }

    const secondsLeft = options.timeToMakeGrid - (now - makeGridStartTime) / 1000;

    return <OuterDiv>
        <RackAndBoard />
        <GridStatus scoreCard={playerData[playerID].scoreCard} grid={grid} />
        <ButtonAndTimeDiv>
            <DoneDialog/>
            <TimeLeft>{"Time left " + minutesAndSeconds(secondsLeft)}</TimeLeft>
        </ButtonAndTimeDiv>
    </OuterDiv>;
}