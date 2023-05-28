import React from "react";
import styled from "styled-components";

const borderColor = {
    inactive: "rgb(139, 0, 0, .5)", /* based on darkred */
    active: "rgba(139, 0, 0)", /* darkred */
};

const ScorePadDiv = styled.div<{active: boolean}>`
    display: block;
    border: 4px solid ${props => props.active ? borderColor.active : borderColor.inactive};
    background-color: cornsilk;
    font-family: Arial;

    > * + * {
        border-top: 1px solid black;
    };
`;

const TotalScoresDiv = styled.div`
    display: flex;

    > * + * {
        border-left: 1px solid black;
    };

    font-weight: bolder;
    font-size: large;

    > * {
        flex: 1;
        font-family: "courier new", monospace;
        display: flex;
        flex-direction: column;
        align-items: end;
        padding-right: 0.2em;
    }
`;

const NameDiv = styled.div`
    font-size: x-large;
    font-weight: bold;
    padding-left: 0.2em;
    opacity: 0.7;
`;

const SingleScoreDiv = styled.div<{showingText: boolean}>`
    padding-left: 0.2em;
    font-size: large;
    background-color: white;
    opacity: ${props => props.showingText ? 0.8 : 1};
    font-family: ${props => props.showingText ? "inherit" : "courier new, monospace"};
    font-weight: ${props => props.showingText ? "inherit" : "bolder"};
`;  

function singleScore(text: string, score: number | null | undefined) {
    if(score === undefined) {
        return null;
    }
    return <SingleScoreDiv 
        showingText={score === null}
    >
        {score === null ? text : score}
    </SingleScoreDiv>;
}

export function ScorePad({name, active, score, partialScore, previousScores}: {
    /** Players name */
    name: string,

    /** Is the player active (affects only appearance) */
    active: boolean,
    
    /** The current score, excluding partial scores */
    score?: number | null,

    /** The current partial score. Not displayed if undefined */
    partialScore?: number | null,
    
    /** The previous scores */
    previousScores: number[],
}) : JSX.Element
{
    // Array containing the running totals
    const runningTotals = [];
    if(previousScores.length > 0) {
        runningTotals.push(previousScores[0]);
        for(let i = 1; i < previousScores.length; i++) {
            runningTotals.push(runningTotals[i - 1] + previousScores[i]);
        }   
    }

    function columnOfNumbers(heading: string, numbers: number[]) {
        return <div>
            <div>{heading}</div>
            {numbers.map((number, index) => <div key={index}>{number}</div>)}
        </div>;
    }

    return <ScorePadDiv active={active}>
        <NameDiv>{name}</NameDiv>
        {singleScore("Partial score", partialScore)}
        {singleScore("Score", score)}
        <TotalScoresDiv>
            {columnOfNumbers("Score", previousScores)}
            {columnOfNumbers("Total", runningTotals)}
        </TotalScoresDiv>
    </ScorePadDiv>;
}
