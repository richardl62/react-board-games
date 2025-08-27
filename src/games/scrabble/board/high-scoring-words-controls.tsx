import React from "react";
import { GoToStart, StepBackwards, StepForwards } from "./forward-back-arrows";
import { useScrabbleContext } from "../client-side/scrabble-context";
import { sAssert } from "../../../utils/assert";
import styled from "styled-components";

const OuterDiv = styled.div`
    margin-top: 5px;
    display: flex;

    > * + * {
        margin-left: 5px;
    }
`;

const ControlDiv = styled.div`
    button {
        margin-right: 5px;
    }
`;

// Add padding on left and right
const Padded = styled.div<{padding: string}>`
    padding-left: ${props => props.padding};
    padding-right: ${props => props.padding};
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
            <Padded padding="0.2em">
                <GoToStart />
            </Padded>
        </button>

        <button onClick={() => selectWord(position-1)} disabled={position === 0}>
            <Padded padding="1.5em">
                <StepBackwards />
            </Padded>
        </button>

        <button onClick={() => selectWord(position+1)} disabled={position === nWordFounds-1}>
            <Padded padding="1.5em">
                <StepForwards />
            </Padded>
        </button>

        {`(${position!+1} of ${nWordFounds})`}
    </ControlDiv>;
}

export function HighScoringWordsControls() : JSX.Element | null {
    const  { highScoringWords, options, dispatch, legalWords, reviewGameHistory} = useScrabbleContext();
    const enabled = highScoringWords !== null;
    const nWordsFound = highScoringWords?.possibleWords.length;

    if(!options.enableHighScoringWords && !reviewGameHistory) {
        return null;
    }
    
    return <OuterDiv>
        <label>{"Suggest words "}
            <input type="checkbox"
                checked={enabled}
                onChange={() => dispatch({
                    type: "enableHighScoringWords",
                    data: { enable: !enabled, legalWords }
                })}
            />
        </label>

        {enabled &&
            (nWordsFound === 0 ? <div>No legal words found</div> : <Controls />)
        }

    </OuterDiv>;
}