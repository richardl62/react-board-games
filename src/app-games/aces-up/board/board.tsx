import { JSX } from "react";
import styled from "styled-components";
import { rowGap } from "../game-support/styles";
import { PlayerAreas } from "./player-areas";
import { debugOptionsInUse } from "../game-support/debug-options";
import { SharedPiles } from "./shared-piles";

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
        {debugOptionsInUse() &&
            <div> Warning: Debug options in use </div>
        }

        <SharedPiles />
        <PlayerAreas />
    </OuterDiv>;
}