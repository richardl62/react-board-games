import React from "react";
import styled from "styled-components";
import { rowGap } from "../game-support/styles";
import { SharedArea } from "./shared-area";
import { PlayerAreas } from "./player-areas";

const OuterDiv = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${rowGap.betweenAreas};

    width: 100%;
    min-height: 100vh;

    background-color: green;
    padding: 2%;

    color: white;

    font-size: 18px;
    font-family: Helvetica;
`;

export default function Board() : JSX.Element {
    return <OuterDiv>
        <SharedArea />
        <PlayerAreas />
    </OuterDiv>;
}