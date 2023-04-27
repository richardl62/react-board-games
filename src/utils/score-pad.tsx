import React from "react";
import styled from "styled-components";

const ScorePadDiv = styled.div<{active: boolean}>`
    display: inline-block;
    border: 4px solid ${props => props.active ? "darkred" : "orange"};
    background-color: cornsilk;
    
    > * + * {
        border-top: 1px solid black;
    };
`;

const TotalScoresDiv = styled.div`
    display: flex;

    > * + * {
        border-left: 1px solid black;
    };

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
    font-size: 1.4em;
`;

const SingleScoreDiv = styled.div`
    background-color: white;
`;  

function singleScore(text: string, score: number | null | undefined) {
    if(score === undefined) {
        return null;
    }
    return <SingleScoreDiv>{score === null ? text : score}</SingleScoreDiv>;
}

export function ScorePad({name, active, score, partialScore, previousScores}: {
    /** Players name */
    name: string,

    /** Is the player active (affects only appearance) */
    active: boolean,
    
    /** The current score, excluding partial scores */
    score: number | null,

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

const SampleScorePadsDiv = styled.div`
    display: block;
    > * {
        min-width: 10em;
    }
    /* Set gap between children */
    > * + * {
        margin-left: 1em;
    }
`;
// Some ScorePad samples
export function SampleScorePads() : JSX.Element {
    return <SampleScorePadsDiv>
        <ScorePad name="Player 1" active={true} score={10} partialScore={null} previousScores={[1, 2, 3, 4, 5]} />
        <ScorePad name="Player 2" active={false} score={null} partialScore={20} previousScores={[1, 2, 3, 4, 5]} />
    </SampleScorePadsDiv>;
}