import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { columnGap } from "../game-support/styles";
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
    const { playerID: contextPlayerID, getPlayerName,
        ctx: {currentPlayer} } = useGameContext();

    let message = getPlayerName(inputPlayerID);
    if(contextPlayerID === currentPlayer) {
        message += " (Your turn)";
    }
    return <OuterDiv>
        <Text>{message}</Text>
        <InnerDiv>
            <MainPile playerID={inputPlayerID}/>
            <Discards playerID={inputPlayerID}/>
            { inputPlayerID === contextPlayerID && <Hand playerID={inputPlayerID}/> }  
        </InnerDiv>
    </OuterDiv>;
}
