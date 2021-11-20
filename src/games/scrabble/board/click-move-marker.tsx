import React from "react";
import styled from "styled-components";
import { ClickMoveDirection } from "../actions/local-game-state";
import { squareSize } from "./style";
import {ReactComponent as Arrow} from "./216093_right_arrow_icon.svg";
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
        <Arrow  height={"100%"}  width={"100%"}/>
    </OuterDiv>;
}