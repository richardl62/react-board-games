import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { columnGap } from "../game-support/styles";
import { ConfirmPenaltyCard } from "./confirm-penalty-card";
import { Discards } from "./discard-piles";
import { Hand } from "./hand";
import { MainPile } from "./main-pile";

const OuterDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: start;
    align-self: start;
`;

const InnerDiv = styled.div`
    display: flex;
    flex-wrap: wrap;

    column-gap: ${columnGap.betweenAreas};
`;

const Text = styled.div`
    margin-bottom: 2px;
`;

interface Props {
    playerID: string;
}

export function PlayerArea(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;
    const { playerID: bgioPlayerID, getPlayerName,
        ctx: {currentPlayer} } = useGameContext();

    const myHand = inputPlayerID === bgioPlayerID;

    let message = getPlayerName(inputPlayerID);
    if( inputPlayerID === currentPlayer ) {
        if(myHand)
            message += " (Your turn)";
        else
            message += " (Their turn)";
    }
    return <OuterDiv>
        <Text>{message}</Text>
        <ConfirmPenaltyCard {...props}/>
        <InnerDiv>
            <MainPile playerID={inputPlayerID}/>
            <Discards playerID={inputPlayerID}/>
            { myHand && <Hand playerID={inputPlayerID}/> }  
        </InnerDiv>
    </OuterDiv>;
}
