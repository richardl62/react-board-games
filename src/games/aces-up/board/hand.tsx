import { PlayerID } from "boardgame.io";
import React from "react";
import styled from "styled-components";
import { cardSize } from "../../../utils/cards/styles";
import { useGameContext } from "../game-support/game-context";
import { AreaLabel } from "./area-label";
import { CardDraggable } from "./drag-drop";

const CardsDiv = styled.div`
    display: flex;
    height: ${cardSize.height}px; //KLUDGE: Avoids a gap below the card for which I don't
                                  //understand the reason.
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
        <AreaLabel>Hand</AreaLabel>
    </div>;
}
