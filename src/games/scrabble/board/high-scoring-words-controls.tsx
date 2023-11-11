import React from "react";
import { GoToStart, StepBackwards, StepForwards } from "./forward-back-arrows";
import { useScrabbleContext } from "../client-side/scrabble-context";
import { sAssert } from "../../../utils/assert";
import styled from "styled-components";

const ControlDiv = styled.div`
    button {
        margin-right: 5px;
    }
`;

function Controls() {
    const  { highScoringWords, dispatch } = useScrabbleContext();
    sAssert(highScoringWords);

    const nWordFounds = highScoringWords.possibleWords.length;
    const position = highScoringWords.position;
    sAssert(position >= 0 && position < nWordFounds, 
        `HSW: Bad postion ${position} with ${nWordFounds} words`);

    const selectWord = (index: number) => {
        dispatch({
            type: "setHighScoringWordsPosition",
            data: {position: index}
        });
    };

    return <ControlDiv>
        <button onClick={() => selectWord(0)} disabled={position === 0}>
            <GoToStart />
        </button>

        <button onClick={() => selectWord(position-1)} disabled={position === 0}>
            <StepBackwards />
        </button>

        <button onClick={() => selectWord(position+1)} disabled={position === nWordFounds-1}>
            <StepForwards />
        </button>

        {`(Showing word ${position!+1} of ${nWordFounds})`}
    </ControlDiv>;
}
export function HighScoringWordsControls() : JSX.Element {
    const  { highScoringWords, dispatch, legalWords} = useScrabbleContext();
    const enabled = highScoringWords !== null;
    const nWordsFound = highScoringWords?.possibleWords.length;

    return <div>
        <div>
            <label>{"Show high scroring words "}
                <input type="checkbox"
                    checked={enabled}
                    onChange={() => dispatch({
                        type: "enableHighScoringWords",
                        data: { enable: !enabled, legalWords }
                    })}
                />
            </label>
        </div>
        
        {enabled &&
            (nWordsFound === 0 ? <div>No legal words found</div> : <Controls />)
        }

    </div>;
}