import React from "react";
import styled from "styled-components";

export const arrowHeight = "15px";
const arrowColor = "darkred";

// To do: Consider making this into a utility class that can also be used by
// the ArrowHead in click-move-marker.tsx
export const StepForwards = styled.div`
    /* Using 3 borders gives as arrow head */
    border-top: calc(${arrowHeight}/2) solid transparent;
    border-left: calc(${arrowHeight}/2) solid ${arrowColor};
    border-bottom: calc(${arrowHeight}/2) solid transparent;
`;

export const StepBackwards = styled.div`
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

const CompositeArray = styled.div`
    display: flex;  
`;

export function GoToStart() : JSX.Element {
    return <CompositeArray>
        <Block /><StepBackwards /><StepBackwards />
    </CompositeArray>;
}

export function GoToEnd() : JSX.Element {
    return <CompositeArray>
        <StepForwards /><StepForwards /><Block />
    </CompositeArray>;
}
