import React from "react";
import styled from "styled-components";
import { squareSize } from "../../games/scrabble/board/style";

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
       

export type ClickMoveDirection = "right" | "down";

export function nextCickMoveDirection(current: ClickMoveDirection| null) : ClickMoveDirection | null {
    if(current === null) {
        return "right";
    }

    if(current === "right") {
        return "down";
    }

    return null;
}

interface ClickMoveMarkerProps {
    direction: ClickMoveDirection;
}

export function ClickMoveMarker(props: ClickMoveMarkerProps) : JSX.Element {
    return <OuterDiv rotation={props.direction === "down" ? "90deg" : "none" } >
        <ArrowHead />
    </OuterDiv>;
}