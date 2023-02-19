import React from "react";
import styled from "styled-components";
import { usePlayerData } from "../game-support/game-context";
import { columnGap } from "../game-support/styles";
import { AreaLabelBelow } from "./area-label";
import { DiscardPile } from "./discard-pile";
import { PlayerInfo } from "./player-info";

const PilesDiv = styled.div`
    display: flex;
    
    column-gap: ${columnGap.betweenCards};
`;

interface Props {
    playerInfo: PlayerInfo;
}

export function Discards(props: Props) : JSX.Element {
    const { playerInfo } = props;

    const { discards } = usePlayerData(playerInfo.owner);

    const discardPiles = discards.map((cards,index) =>
        <DiscardPile key={index} cards={cards} index={index} owner={playerInfo.owner}/>);
    
    return <div>
        <PilesDiv> {discardPiles} </PilesDiv>
        <AreaLabelBelow>Discards</AreaLabelBelow>
    </div>;
}
