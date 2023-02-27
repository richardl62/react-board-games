import React from "react";
import styled from "styled-components";
import { cardShortName, rankName } from "../../../utils/cards/types";
import { useGameContext } from "../game-support/game-context";
import { SharedPile } from "../game-control/shared-pile";
import { CardDraggable } from "./drag-drop";
import { columnGap } from "../game-support/styles";

const TextDiv = styled.div`
    text-align: center;
`;

const SharedPilesDiv = styled.div`
    display: inline-flex;
    flex-wrap: wrap;

    column-gap: ${columnGap.betweenCards};
`;

interface PileProps {
    pile: SharedPile;
    pileIndex: number;
}

function Pile(props: PileProps) {
    const { pile, pileIndex } = props;

    const topCard = pile.cards && pile.cards[pile.cards.length-1];
    const showRank = topCard && pile.rank != topCard.rank;
    
    return <div>
        <CardDraggable card={topCard} 
            id={{area: "sharedPiles", index: pileIndex}} 
        />
        <TextDiv> {showRank && rankName(pile.rank)} </TextDiv>

    </div>;
}

export function SharedPiles() : JSX.Element {
    const { G: {sharedPiles} } = useGameContext();

    return <SharedPilesDiv> {sharedPiles.map((pile, index) => {
        let name = "";
        if(pile.cards) {
            name = pile.cards.reduce((str, card) => str + cardShortName(card), ""); 
        }
        return <Pile key={name+index} pile={pile} pileIndex={index} />;
    })}
    </SharedPilesDiv>;
}