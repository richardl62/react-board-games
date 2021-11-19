import React from "react";
import styled from "styled-components";
import { ClickMoveDirection } from "../actions/local-game-state";

const ArrowDiv = styled.div`
    height: 100%;
    width: 100%;
    
    font-size: 100%;
    font-weight: 900;
`;

interface ClickMoveMarkerProps {
    direction: ClickMoveDirection;
}

export function ClickMoveMarker(props: ClickMoveMarkerProps) : JSX.Element {
    return props.direction === "right" ?
        <ArrowDiv>&rarr;</ArrowDiv> : <ArrowDiv>&darr;</ArrowDiv>;
}