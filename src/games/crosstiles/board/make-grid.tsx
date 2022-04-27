import React, { useEffect } from "react";
import styled from "styled-components";
import { useCountdown } from "../../../utils/use-countdown";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { checkGrid } from "../client-side/check-grid/check-grid";
import { Letter, maxTimeToMakeGrid } from "../config";
import { displayName, ScoreCategory } from "../server-side/score-categories";
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
    const { stage, grid, round } = context;
    const { moves } = context.wrappedGameProps;

    const {secondsLeft, reset} = useCountdown(maxTimeToMakeGrid);
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


    // if(secondsLeft === 0) {
    //     recordGrid();
    // }

    return <OuterDiv>
        <RackAndBoard />

        <GridStatus grid={grid} />

        <div>
            <button onClick={recordGrid}>Record Grid</button>
            <TimeLeft>{minutesAndSeconds(secondsLeft)}</TimeLeft>
        </div>
    </OuterDiv>;
}

function GridStatus({grid} : {grid: (Letter| null)[][]}) {

    const {validScores} = checkGrid(grid);
    const displayNames = Object.keys(validScores).map(category =>
        displayName[(category as ScoreCategory)]
    );

    return <div>
        {displayNames.map(name =>
            <span key={name}>{name}</span>
        )}
    </div>;

}