import React from "react";
import styled from "styled-components";
import { useScrabbleContext } from "./scrabble-context";

const arrowHeight = "15px";
const arrowColor = "darkred";

// To do: Consider making this into a utility class that can also be used by
// the ArrowHead in click-move-marker.tsx
const ArrowHeadRight = styled.div`
    /* Using 3 borders gives as arrow head */
    border-top: calc(${arrowHeight}/2) solid transparent;
    border-left: calc(${arrowHeight}/2) solid ${arrowColor};
    border-bottom: calc(${arrowHeight}/2) solid transparent;
`;

const ArrowHeadLeft = styled.div`
    /* Using 3 borders gives as arrow head */
    border-top: calc(${arrowHeight}/2) solid transparent;
    border-right: calc(${arrowHeight}/2) solid ${arrowColor};
    border-bottom: calc(${arrowHeight}/2) solid transparent;
`;

const Block = styled.div`
    height: ${arrowHeight};
    width: calc(${arrowHeight}*0.2);
    background-color: ${arrowColor};
`;

const HistoryButton = styled.button`
  display: flex;
`;

const HistoryButtons = styled.div`
  display: flex;
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
    const { historyPosition, historyLength } = context;

    const setHistoryPosition = (num: number) => {
        context.dispatch({type: "setHistoryPosition", data: {position: num}});
    };

    const atHistoryStart = historyPosition === 0;
    const atHistoryEnd = historyPosition === historyLength - 1;

    return <Controls>
        <HistoryButtons>
            <HistoryButton onClick={() => setHistoryPosition(0)} disabled={atHistoryStart}>
                <Block /><ArrowHeadLeft /><ArrowHeadLeft />
            </HistoryButton>

            <HistoryButton onClick={() => setHistoryPosition(historyPosition - 1)} disabled={atHistoryStart}>
                <ArrowHeadLeft /> </HistoryButton>

            <HistoryButton onClick={() => setHistoryPosition(historyPosition + 1)} disabled={atHistoryEnd}>
                <ArrowHeadRight />
            </HistoryButton>

            <HistoryButton onClick={() => setHistoryPosition(historyLength - 1)} disabled={atHistoryEnd}>
                <ArrowHeadRight /><ArrowHeadRight /><Block />
            </HistoryButton>
        </HistoryButtons>

    </Controls>;
}


