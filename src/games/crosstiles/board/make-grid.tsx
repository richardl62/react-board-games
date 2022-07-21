import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import {  useNowTicker } from "../../../utils/use-countdown";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";
import { GridStatus } from "./grid-status";
import { RackAndBoard } from "./rack-and-board";
import { makeEmptyGrid } from "../server-side/make-empty-grid";
import { PlayerStatus } from "./player-status";
import { RecordAndDoneButtons, RecordRequest } from "./record-and-done-buttons";

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

export function MakeGrid() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { playerData, stage, grid, options } = context;
    const { moves,  playerID } = context.wrappedGameProps;

    const now = useNowTicker();

    const [showIllegalWords, setShowIllegalWords] = useState(false);

    const {makeGridStartTime, 
        gridRackAndScore: recordedGridRackAndScore,
        doneRecordingGrid: amDoneRecording,
        selectedLetters, 
    } = playerData[playerID];

    useEffect(()=>{
        if(stage === GameStage.makingGrids) {

            if(makeGridStartTime === null) {
                moves.setMakeGridStartTime(now);
            } else {
                const timesUp = options.timeToMakeGrid < (now - makeGridStartTime) / 1000;
                if(timesUp && !amDoneRecording) {
                    if(!recordedGridRackAndScore) {
                        sAssert(selectedLetters);
                        moves.recordGrid({grid: makeEmptyGrid(), rack: selectedLetters, score: null});
                    }
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

    const doneMessage = (pid: string) =>
        playerData[pid].doneRecordingGrid ? "Done" : null;

    const recordRequest = (status: RecordRequest) => {
        setShowIllegalWords(status === "blockedWithIllegalWords");
    };

    return <OuterDiv>
        <RackAndBoard />
        <GridStatus scoreCard={playerData[playerID].scoreCard} grid={grid} 
            checkSpelling={showIllegalWords}/>
        <ButtonAndTimeDiv>
            <RecordAndDoneButtons recordRequest={recordRequest}/>
            <PlayerStatus message={doneMessage} />
            <TimeLeft>{"Time left " + minutesAndSeconds(secondsLeft)}</TimeLeft>
        </ButtonAndTimeDiv>
    </OuterDiv>;
}
