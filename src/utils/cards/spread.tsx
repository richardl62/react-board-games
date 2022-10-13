import React from "react";
import styled from "styled-components";

const OuterDiv = styled.div<{height: number, width: number}>`
    display: block;
    position: relative;
    height: auto;
    height: ${props => props.height}px;
    width: ${props => props.width}px;
`;

const Positioned = styled.div<{left: number, zIndex: number}>`
    position: absolute;
    height: auto;
    width: auto;

    top: 0px;
    left: ${props => props.left}px;

    z-index: ${props => props.zIndex};
`;

/** Return a separation that would have the elems exactly fit the given width.
 * The result will be -ve if the elements need to overlap.
*/
function naturalSeparation(nElems: number, 
    {totalWidth, elemWidth} : {totalWidth: number, elemWidth: number}
) {
    const nGaps = nElems - 1;
    const totalSeparation = totalWidth - nElems * elemWidth;
    
    return totalSeparation / nGaps;
}

interface SpreadProps {
    totalWidth: number;
    elemWidth: number;
    elemHeight: number;
    maxElemSeparation: number;
    
    elems: JSX.Element[];
}

export function Spread(props: SpreadProps) : JSX.Element {
    const {totalWidth, elemWidth, elemHeight, maxElemSeparation, elems} = props;

    const separation = Math.min(
        naturalSeparation(elems.length, props), maxElemSeparation);

    return <OuterDiv width={totalWidth} height={elemHeight}>
        {elems[0]}
        {elems.map((elem, index) => {
            return <Positioned key={index} zIndex={index}
                left={index* (elemWidth + separation)}
            >
                {elem}
            </Positioned>;
        })}
    </OuterDiv>;
}