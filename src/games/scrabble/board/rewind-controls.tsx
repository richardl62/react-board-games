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

const Control = styled.button`
    display: flex;
    margin-right: calc(${arrowHeight}*0.5);
`;

const Controls = styled.div`
  display: flex;
  margin-top: calc(${arrowHeight}*0.5);
`;

export function RewindControls() : JSX.Element {
    const context = useScrabbleContext();
    const { historyPosition, historyLength } = context;
    const setStateIndex = context.bgioProps.moves.setCurrentStateIndex;

    const atHistoryStart = historyPosition === 0;
    const atHistoryEnd = historyPosition === historyLength - 1;

    return <Controls>
        <Control onClick={()=>setStateIndex(0)} disabled={atHistoryStart}> 
            <Block/><ArrowHeadLeft/><ArrowHeadLeft/> 
        </Control>
        
        <Control onClick={()=>setStateIndex(historyPosition-1)} disabled={atHistoryStart}> 
            <ArrowHeadLeft/> </Control>
        
        <Control onClick={()=>setStateIndex(historyPosition+1)} disabled={atHistoryEnd}> 
            <ArrowHeadRight/>
        </Control>
 
        <Control onClick={()=>setStateIndex(historyLength-1)} disabled={atHistoryEnd}>
            <ArrowHeadRight/><ArrowHeadRight/><Block/>
        </Control>

    </Controls>;
}


