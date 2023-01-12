import React, { useState } from "react";
import styled from "styled-components";
import { LetterSelector } from "./letter-selector";
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


// Prehaps this should be generalised into a 'button with confirmation' untility
function PassDialog() {
    const [ awaitingConfirmation, setAwaitingConfirmation ] = useState(false);

    const { onPass } = useTurnControlData();
    if(!onPass) {
        return null;
    }

    if(awaitingConfirmation) {
        return <>
            <button onClick={()=>{setAwaitingConfirmation(false); onPass();}}>
                Confirm Pass</button>
            <button onClick={()=>setAwaitingConfirmation(false)}>Cancel</button>
        </>;
    }
    return <>

        <span>Your turn </span>
        <button onClick={()=>setAwaitingConfirmation(true)}>Pass</button>
    </>;
}

/** 'Dumb' class that does the formatting for TurnControl */
export function TurnControl(): JSX.Element {
    const { score, illegalWords, onDone, onSetBlank, doSetBlank } = useTurnControlData();
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
                <PassDialog/>
                {onSetBlank && <button onClick={onSetBlank}>Set Blank</button>}
                {onDone && <button onClick={onDone}> {doButtonText} </button>}
            </StyledScoreLine>
        </div>
    );
}
