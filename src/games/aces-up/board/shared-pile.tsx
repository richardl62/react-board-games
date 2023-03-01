import React from "react";
import { rankName } from "../../../utils/cards/types";
import { SharedPile as SharedPileType } from "../game-control/shared-pile";
import { CardStack } from "./card-stack";
import { TextDiv } from "./shared-piles";

export function SharedPile(props: {
    pile: SharedPileType;
    pileIndex: number;
}): JSX.Element  {
    const { pile, pileIndex } = props;

    const topCard = pile.cards && pile.cards[pile.cards.length - 1];
    const showRank = topCard && pile.rank != topCard.rank;

    const allCards = pile.cards || [];
    const displayCards = allCards.length <= 2 ? allCards :
        [allCards[0], allCards[allCards.length - 1]]; // first and last card

    return <div>
        <CardStack
            cards={displayCards}
            dropID={{ area: "sharedPiles", index: pileIndex }} />
        <TextDiv> {showRank && rankName(pile.rank)} </TextDiv>
    </div>;
}
