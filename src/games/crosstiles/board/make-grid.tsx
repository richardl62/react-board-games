import React, { useEffect } from "react";
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

    const gridRecorded = Boolean(playerData[playerID].grid);

    return <div>
        <button onClick={() => moves.recordGrid(grid)} >
            Record Grid
        </button>

        {gridRecorded && <button onClick={() => moves.doneRecordingGrid()}> 
            Done
        </button>}
    </div>;
}

function WaitingForPlayers() {
    const context = useCrossTilesContext();
    const { playerData, wrappedGameProps: {getPlayerName} } = context;
    const notFinished : string[] = [];
    for(const pid in playerData) {
        if(!playerData[pid].doneRecordingGrid) {
            notFinished.push(getPlayerName(pid));
        }
    }
    return <div>{"Waiting for " + notFinished.join(", ")}</div>;
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
            {amDoneRecording ? <WaitingForPlayers/> : <DoneDialog/> }
            <TimeLeft>{"Time left " + minutesAndSeconds(secondsLeft)}</TimeLeft>
        </ButtonAndTimeDiv>
    </OuterDiv>;
}