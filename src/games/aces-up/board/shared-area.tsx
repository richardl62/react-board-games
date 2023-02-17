import React from "react";
import styled from "styled-components";
import { ConfirmPenaltyCard } from "./confirm-penalty-card";
import { SharedPiles } from "./shared-piles";

const OuterDiv = styled.div`
    align-self: start;

    display: flex;
    flex-direction: column;
`;

const Text = styled.div`
  align-self: center;  
`;

export function SharedArea(): JSX.Element {
    return <OuterDiv>
        <ConfirmPenaltyCard />
        <Text>Shared Piles</Text>
        <SharedPiles />
    </OuterDiv>;
}