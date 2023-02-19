import React from "react";
import styled from "styled-components";
import { usePlayerData } from "../game-support/game-context";
import { columnGap } from "../game-support/styles";
import { AreaLabelBelow } from "./area-label";
import { CardDraggable } from "./drag-drop";
import { PlayerInfo } from "./player-info";

const CardsDiv = styled.div`
    display: flex;
    
    column-gap: ${columnGap.betweenCards};
`;

interface Props {
    playerInfo: PlayerInfo;
}

export function Hand(props: Props) : JSX.Element {
    const { playerInfo } = props;

    const { hand } = usePlayerData(playerInfo.owner);

    const cards =  hand.map((card,index) =>
        <CardDraggable
            key={index} card={card}
            id={{ area: "hand", index, owner: playerInfo.owner }}
        />);
    
    return <div>
        <CardsDiv> {cards} </CardsDiv>
        <AreaLabelBelow>Hand</AreaLabelBelow>
    </div>;
}
