import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useScrabbleContext } from "../client-side/scrabble-context";
import { GoToStart, GoToEnd, StepForwards, StepBackwards, arrowHeight } from "./forward-back-arrows";

const HistoryButtons = styled.div`
  margin-top: calc(${arrowHeight}*0.5);
  margin-bottom: calc(${arrowHeight}*0.2);

  > *:not(:last-child) {
    margin-right: calc(${arrowHeight}*0.5);
  }
`;

const Controls = styled.div`
    display: flex;
    flex-direction: column;
`;

export function RewindControls() : JSX.Element {
    const context = useScrabbleContext();
    const { reviewGameHistory, historyLength } = context;

    sAssert(reviewGameHistory);
    const { historyPosition } = reviewGameHistory;

    const setHistoryPosition = (num: number) => {
        context.dispatch({type: "setHistoryPosition", data: {position: num}});
    };

    const atHistoryStart = historyPosition === 0;
    const atHistoryEnd = historyPosition === historyLength - 1;

    return <Controls>
        <HistoryButtons>
            <button onClick={() => setHistoryPosition(0)} disabled={atHistoryStart}>
                <GoToStart />
            </button>

            <button onClick={() => setHistoryPosition(historyPosition - 1)} disabled={atHistoryStart}>
                <StepBackwards/> 
            </button>

            <button onClick={() => setHistoryPosition(historyPosition + 1)} disabled={atHistoryEnd}>
                <StepForwards/> 
            </button>

            <button onClick={() => setHistoryPosition(historyLength - 1)} disabled={atHistoryEnd}>
                <GoToEnd/>
            </button>
        </HistoryButtons>

    </Controls>;
}


