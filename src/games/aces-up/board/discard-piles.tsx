import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { AreaLabel } from "./area-label";
import { DiscardPile } from "./discard-pile";

const PilesDiv = styled.div`
    display: flex;
`;

interface Props {
    playerID: string;
}

export function Discards(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;
    const { G : { playerData } } = useGameContext();

    const { discards } = playerData[inputPlayerID];
    const discardPiles = discards.map((cards,index) =>
        <DiscardPile key={index} cards={cards} index={index} owner={inputPlayerID}/>);
    
    return <div>
        <PilesDiv> {discardPiles} </PilesDiv>
        <AreaLabel>Discards</AreaLabel>
    </div>;
}
