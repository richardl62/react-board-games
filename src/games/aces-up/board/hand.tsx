import { PlayerID } from "boardgame.io";
import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { columnGap } from "../game-support/styles";
import { AreaLabelBelow } from "./area-label";
import { CardDraggable } from "./drag-drop";

const CardsDiv = styled.div`
    display: flex;
    
    column-gap: ${columnGap.betweenCards};
`;

interface Props {
    playerID: PlayerID;
}

export function Hand(props: Props) : JSX.Element {
    const { playerID: inputPlayerID } = props;
    const { G : { playerData } } = useGameContext();

    const { hand } = playerData[inputPlayerID];
    const cards =  hand.map((card,index) =>
        <CardDraggable
            key={index} card={card}
            id={{ area: "hand", index, owner: inputPlayerID }}
        />);
    
    return <div>
        <CardsDiv> {cards} </CardsDiv>
        <AreaLabelBelow>Hand</AreaLabelBelow>
    </div>;
}
