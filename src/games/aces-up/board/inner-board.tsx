import React from "react";
import styled from "styled-components";
import { rowGap } from "../game-support/styles";
import { SharedArea } from "./shared-area";
import { PlayerAreas } from "./player-areas";

const GameDiv = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${rowGap.betweenAreas};
    margin: 2%;
`;

export default function InnerBoard() : JSX.Element {
    return <GameDiv>
        <SharedArea />
        <PlayerAreas />
    </GameDiv>;
}