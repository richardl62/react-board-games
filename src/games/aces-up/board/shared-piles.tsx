import React from "react";
import styled from "styled-components";
import { cardShortName, rankName } from "../../../utils/cards/types";
import { useGameContext } from "../game-support/game-context";
import { SharedPile } from "../game-control/shared-pile";
import { columnGap } from "../game-support/styles";
import { CardStack } from "./card-stack";

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

    const allCards = pile.cards || [];
    const displayCards = allCards.length <= 2 ? allCards : 
        [allCards[0], allCards[allCards.length-1]]; // first and last card
    
    return <div>
        <CardStack 
            cards={displayCards} 
            dropID={{area: "sharedPiles", index: pileIndex}} 
        />
        <TextDiv> {showRank && rankName(pile.rank)} </TextDiv>

    </div>;
}

export function SharedPiles() : JSX.Element {
    const { G: {sharedPiles} } = useGameContext();

    const key = (pile: SharedPile, index: number) => {
        if(!pile.cards) {
            return index;
        }
        return pile.cards.reduce((str, card) => str + cardShortName(card), String(index));
    };
        
    return <SharedPilesDiv> {
        sharedPiles.map((pile, index) =>
            <Pile key={key(pile, index)} pile={pile} pileIndex={index} />)
    }
    </SharedPilesDiv>;
}