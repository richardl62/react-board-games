import React from "react";
import styled from "styled-components";
import { cardSize } from "../../../utils/cards/styles";
import { SharedPiles } from "./shared-piles";

const OuterDiv = styled.div`
    align-self: start;

    display: flex;
    flex-direction: column;

    margin-left: ${cardSize.width/2}px;
`;

export function SharedArea(): JSX.Element {
    return <OuterDiv>
        <SharedPiles />
    </OuterDiv>;
}