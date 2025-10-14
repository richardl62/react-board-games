import { JSX, useEffect, useState } from "react";
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
import { MakeGridCountDown } from "./make-grid-countdown";

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

interface MakeGridInnerProps {
    secondsLeft: number;
}

function MakeGridInner(props: MakeGridInnerProps) : JSX.Element {
    const { secondsLeft } = props;
    
    const context = useCrossTilesContext();
    const { playerData, stage, grid } = context;
    const { moves,  playerID } = context.wrappedGameProps;
    const [showIllegalWords, setShowIllegalWords] = useState(false);

    sAssert(stage === GameStage.makingGrids);

    const {
        gridRackAndScore: recordedGridRackAndScore,
        doneRecordingGrid: amDoneRecording,
        selectedLetters, 
    } = playerData[playerID];

    useEffect(() => {
        if (secondsLeft < 0 && !amDoneRecording) {
            if (!recordedGridRackAndScore) {
                sAssert(selectedLetters);
                moves.recordGrid({ grid: makeEmptyGrid(), rack: selectedLetters, score: null });
            }
            moves.doneRecordingGrid();
        }
    });

    const doneMessage = (pid: string) => {
        if ( pid === playerID ) {
            return null;
        }

        return playerData[pid].doneRecordingGrid ? "Done" : "Not done";
    };

    const recordRequest = (status: RecordRequest) => {
        setShowIllegalWords(status === "blockedWithIllegalWords");
    };

    return <OuterDiv>
        <RackAndBoard />
        <GridStatus scoreCard={playerData[playerID].scoreCard} grid={grid} 
            checkSpelling={showIllegalWords} />

        {amDoneRecording && <div>Done: Waiting for other player(s)</div>}   
        <ButtonAndTimeDiv>
            {amDoneRecording || 
                <RecordAndDoneButtons recordRequest={recordRequest}/>
            }
            <PlayerStatus message={doneMessage} />
            <TimeLeft>{"Time left " + minutesAndSeconds(secondsLeft)}</TimeLeft>
        </ButtonAndTimeDiv>
    </OuterDiv>;
}

export function MakeGrid() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { playerData, stage, options } = context;
    const { moves,  playerID } = context.wrappedGameProps;

    const now = useNowTicker();

    const { makeGridStartTime } = playerData[playerID];

    useEffect(()=>{
        if(stage === GameStage.makingGrids) {
            if(makeGridStartTime === null) {
                moves.setMakeGridStartTime(now);
            } 
        }
    });

    if(stage !== GameStage.makingGrids) {
        return null;
    }

    if(makeGridStartTime === null) {
        return null;
    }
   
    const secondsSinceStart = (now - makeGridStartTime) / 1000;
    const remainingCountdown = options.makeGridCountdown - secondsSinceStart;

    if(remainingCountdown > 0) {
        return <MakeGridCountDown secondsLeft={remainingCountdown} />;
    }

    const totalTime = options.timeToMakeGrid + options.makeGridCountdown;
    const secondsLeft = totalTime - secondsSinceStart;

    return <MakeGridInner secondsLeft={secondsLeft} />;
}