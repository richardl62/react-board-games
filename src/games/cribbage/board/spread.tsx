import React from "react";
import styled from "styled-components";

const OuterDiv = styled.div<{height: number, width: number}>`
    display: block;
    position: relative;
    height: auto;
    height: ${props => props.height}px;
    width: ${props => props.width}px;

    border: solid black 1px; // Temporary
`;

const Positioned = styled.div<{left: number}>`
    position: absolute;
    height: auto;
    width: auto;

    top: 0px;
    left: ${props => props.left}px;
`;

interface SpreadProps {
    totalWidth: number;
    elemWidth: number;
    elemHeight: number;
    maxElemSeparation: number;
    
    elems: JSX.Element[];
}

export function Spread(props: SpreadProps) : JSX.Element {
    const {totalWidth, elemHeight, elems} = props;

    return <OuterDiv width={totalWidth} height={elemHeight}>
        {elems[0]}
        {elems.map((elem, index) => {
            return <Positioned key={index} left={index*20}>
                {elem}
            </Positioned>;
        })}
    </OuterDiv>;
}