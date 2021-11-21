import React from "react";
import styled from "styled-components";
import { ClickMoveDirection } from "../actions/local-game-state";
import { squareSize } from "./style";
const OuterDiv = styled.div<{rotation: string}>`

    transform:rotate(${props => props.rotation});         /* Standard syntax */
    height: ${squareSize};
    width: ${squareSize};
`;

interface ClickMoveMarkerProps {
    direction: ClickMoveDirection;
}

export function ClickMoveMarker(props: ClickMoveMarkerProps) : JSX.Element {
    console.log(props);
    return <OuterDiv rotation={props.direction === "down" ? "90deg" : "none" } >
        {props.direction}
    </OuterDiv>;
}