import React from "react";
import styled from "styled-components";
import { LetterSelector } from "./letter-selector";
import { GameProps } from "./game-props";
import { useTurnControlData } from "./use-turn-control-data";

export const StyledScoreLine = styled.div`
  display: flex; 
  font-size: large;
  * {
    margin-right: 0.5em;
  };
`;

const StyledIllegalWords = styled.div`
  display: inline-flex;
  gap: 0.5em;
  font-size: large;
  margin-bottom: 0.2em;
  font-weight: bold;
  color: darkred;
`;


/** 'Dumb' class that does the formatting for TurnControl */
export function TurnControl({xxx} :  {xxx: GameProps}): JSX.Element {

    const { score, illegalWords, onPass, onDone, onSetBlank, doSetBlank } = useTurnControlData(xxx);
    const doButtonText = illegalWords ?
        "Done (permitting illegal words)" :
        "Done"
    ;

    if(doSetBlank) {
        return <LetterSelector recordSelection={doSetBlank} />;
    }

    return (
        <div>
            {illegalWords &&
        <StyledIllegalWords>
          Illegal Words:
            {illegalWords.map(w => <span key={w}>{w.toLowerCase()}</span>)}
        </StyledIllegalWords>
            }

            <StyledScoreLine>
                {score && <span>{"Score this turn: " + score}</span>}
                {onPass && <button onClick={onPass}>Pass</button>}
                {onSetBlank && <button onClick={onSetBlank}>Set Blank</button>}
                {onDone && <button onClick={onDone}> {doButtonText} </button>}
            </StyledScoreLine>
        </div>
    );
}
