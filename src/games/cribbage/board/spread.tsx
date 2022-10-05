import React from "react";
import styled from "styled-components";

const OuterDiv = styled.div<{width: number}>`
    display: flex;
    width: ${props => props.width}px;

   
    border: solid black 1px; // Temporary
`;

interface SpreadProps {
    totalWidth: number;
    elemWidth: number;
    maxElemSeparation: number;
    
    elems: JSX.Element[];
}

export function Spread(props: SpreadProps) : JSX.Element {
    const {totalWidth, elems} = props;

    return <OuterDiv width={totalWidth}>{elems}</OuterDiv>;
}