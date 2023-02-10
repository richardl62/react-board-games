import React from "react";
import styled from "styled-components";
import { useGameContext } from "../client-side/game-context";
import { DiscardPiles } from "./discard-piles";
import { Hand } from "./hand";
import { MainPile } from "./main-pile";

const OuterDiv = styled.div`
    border: black 1px solid;
`;

const InnerDiv = styled.div`
    display: flex;
`;

interface Props {
    playerID: string;
}

export function PlayerArea(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;

    const { playerID: contextPlayerID, getPlayerName } = useGameContext();


    return <OuterDiv>
        <div>{getPlayerName(inputPlayerID)}</div>
        <InnerDiv>
            <MainPile playerID={inputPlayerID}/>
            <DiscardPiles playerID={inputPlayerID}/>
            { inputPlayerID === contextPlayerID && <Hand playerID={inputPlayerID}/> }  
        </InnerDiv>
    </OuterDiv>;
}
