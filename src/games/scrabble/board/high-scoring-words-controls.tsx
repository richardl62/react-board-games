import React from "react";
import styled from "styled-components";
import { GoToStart, StepBackwards, StepForwards } from "./forward-back-arrows";
import { useScrabbleContext } from "../client-side/scrabble-context";
import { sAssert } from "../../../utils/assert";

const OuterDiv = styled.div`
    display: flex;
    > *:not(:last-child) {
        margin-right: 5px;
    }
`;

function Arrows() {
    const  { highScoringWords, dispatch } = useScrabbleContext();
    sAssert(highScoringWords);

    const nWords = highScoringWords.possibleWords.length;
    const position = highScoringWords.position;
    sAssert(position >= 0 && position < nWords, 
        `HSW: Bad postion ${position} with ${nWords} words`);

    const selectWord = (index: number) => {
        dispatch({
            type: "setHighScoringWordsPosition",
            data: {position: index}
        });
    };

    return <>
        <button onClick={() => selectWord(0)} disabled={position === 0}>
            <GoToStart />
        </button>

        <button onClick={() => selectWord(position-1)} disabled={position === 0}>
            <StepBackwards />
        </button>

        <button onClick={() => selectWord(position+1)} disabled={position === nWords-1}>
            <StepForwards />
        </button>

        <div>{position}</div>
    </>;
}
export function HighScoringWordsControls() : JSX.Element {
    const  { highScoringWords, dispatch, legalWords} = useScrabbleContext();
    const enabled = highScoringWords !== null;
    const position = highScoringWords?.position;
    const nWordsFound = highScoringWords?.possibleWords.length;
    const score = highScoringWords && highScoringWords.possibleWords[highScoringWords.position].score;

    return <OuterDiv>
        <label>{"Show high scroring words"}
            <input type="checkbox" 
                checked={enabled} 
                onChange={()=>dispatch({
                    type:"enableHighScoringWords",
                    data: {enable: !enabled, legalWords}
                })} 
            />
        </label>
        
        {enabled &&
            (nWordsFound === 0?
                <div>No legal words found</div> :
                <>
                    <Arrows />
                    <div>{` (Showing word ${position!+1} of ${nWordsFound} - score ${score})`}</div>
                </>
            )
        }

    </OuterDiv>;
}