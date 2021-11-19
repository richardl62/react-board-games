import React from "react";
import { ClickMoveDirection } from "../actions/local-game-state";


interface ClickMoveMarkerProps {
    direction: ClickMoveDirection;
}

export function ClickMoveMarker(props: ClickMoveMarkerProps) : JSX.Element {
    return <div>{props.direction}</div>;
}