import { JSX } from "react";
import styled from "styled-components";
import { CardNonJoker, CardSVG } from "../../../utils/cards";
import { cardSize } from "../../../utils/cards/styles";
import { cardShortName } from "../../../utils/cards/types";
import { useGameContext } from "../game-support/game-context";
import { columnGap } from "../game-support/styles";
import { AreaLabelBelow } from "./area-label";
import { CardDraggable } from "./drag-drop";
import { PlayerInfo } from "./player-info";

const CardsDiv = styled.div`
    display: flex;
    
    column-gap: ${columnGap.betweenCards};


    min-width: ${cardSize.width}px;
    min-height: ${cardSize.height}px;
`;

interface Props {
    playerInfo: PlayerInfo;
}

export function Hand(props: Props) : JSX.Element {
    const { playerInfo } = props;

    const { hand } = useGameContext().G.getPlayerData(playerInfo.owner);

    const makeCard = (card: CardNonJoker, index: number) => {
        const key = cardShortName(card) + index;
        
        if(playerInfo.viewer === playerInfo.owner) {
            return <CardDraggable
                key={index} card={card}
                id={{ area: "hand", index, owner: playerInfo.owner }}
            />;
        } 
            
        return <CardSVG key={key} showBack={true} />;
    };
    
    return <div>
        <CardsDiv> {hand.map(makeCard)} </CardsDiv>
        <AreaLabelBelow>Hand</AreaLabelBelow>
    </div>;
}
