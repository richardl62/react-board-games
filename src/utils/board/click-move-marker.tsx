import React from "react";
import styled from "styled-components";
import { WordDirection } from "../word-finder/get-legal-words/word-position";

// KLUDGE - /utils/ should not include anything from /games/
// As a quick and dirty fix copy the value instead
// import { squareSize } from "../../games/scrabble/board/style";
const squareSize = "30px";

const OuterDiv = styled.div<{rotation: string}>`
    display: flex;
    justify-content: center;
    align-items: center;

    transform:rotate(${props => props.rotation});         /* Standard syntax */

    height: ${squareSize};
    width: ${squareSize};
`;

const ArrowHead = styled.div`

    /* Using 3 borders gives as arrow head */
    border-top: calc(${squareSize}*0.3) solid transparent;
    border-left: calc(${squareSize}*0.6) solid #77a81c;
    border-bottom: calc(${squareSize}*0.3) solid transparent;
`;
    

export function nextCickMoveDirection(current: WordDirection| null) : WordDirection | null {
    if(current === null) {
        return "row";
    }

    if(current === "row") {
        return "column";
    }

    return null;
}

interface ClickMoveMarkerProps {
    direction: WordDirection;
}

export function ClickMoveMarker(props: ClickMoveMarkerProps) : JSX.Element {
    return <OuterDiv rotation={props.direction === "column" ? "90deg" : "none" } >
        <ArrowHead />
    </OuterDiv>;
}