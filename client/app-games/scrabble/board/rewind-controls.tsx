import { JSX } from "react";
import styled from "styled-components";
import { sAssert } from "@utils/assert";
import { useScrabbleState } from "../client-side/scrabble-state";
import { GoToStart, GoToEnd, StepForwards, StepBackwards } from "./forward-back-arrows";

const Controls = styled.div`
    display: flex;
    button {
        margin-left: 0.5em;
    }
`;

// Add padding on left and right
const Padded = styled.div<{padding: string}>`
    padding-left: ${props => props.padding};
    padding-right: ${props => props.padding};
`;


export function RewindControls() : JSX.Element {
    const context = useScrabbleState();
    const { reviewGameHistory, historyLength } = context;

    sAssert(reviewGameHistory);
    const { historyPosition } = reviewGameHistory;

    const setHistoryPosition = (num: number) => {
        context.dispatch({type: "setHistoryPosition", data: {position: num}});
    };

    const atHistoryStart = historyPosition === 0;
    const atHistoryEnd = historyPosition === historyLength - 1;

    return <Controls>
        <div>Game history</div>
 
        <button  onClick={() => setHistoryPosition(0)} disabled={atHistoryStart} > 
            <Padded padding="0.2em">
                <GoToStart />
            </Padded >
        </button>

        <button onClick={() => setHistoryPosition(historyPosition - 1)} disabled={atHistoryStart} >
            <Padded padding="1.5em">
                <StepBackwards />
            </Padded>
        </button>

        <button onClick={() => setHistoryPosition(historyPosition + 1)} disabled={atHistoryEnd}>
            <Padded padding="1.5em">
                <StepForwards />
            </Padded>
        </button>

        <button onClick={() => setHistoryPosition(historyLength - 1)} disabled={atHistoryEnd}>
            <Padded padding="0.2em">
                <GoToEnd />
            </Padded>
        </button>


    </Controls>;
}


